package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.entity.*;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.OrderRepository;
import com.silkroute_erp.sales.repository.SpiderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final SpiderRepository spiderRepository;
    private final CustomerService customerService;

    public OrderService(OrderRepository orderRepository, SpiderRepository spiderRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.spiderRepository = spiderRepository;
        this.customerService = customerService;
    }

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {

        Customer customer = customerService.getCustomerById(orderDTO.getCustomerId());
        if (customer == null) {
            throw new CustomerNotFoundException("Customer with id " + orderDTO.getCustomerId() + " not found.");
        }

        Order newOrder = new Order();
        newOrder.setCustomer(customer);
        newOrder.setDate(LocalDate.now());

        // Ustawiamy status z frontendu
        if (orderDTO.getStatus() != null) {
            newOrder.setStatus(OrderStatus.valueOf(orderDTO.getStatus().toUpperCase()));
        } else {
            newOrder.setStatus(OrderStatus.NEW);
        }

        // Ustawiamy kuriera z frontendu
        if (orderDTO.getCourierCompany() != null && !orderDTO.getCourierCompany().isEmpty()) {
            newOrder.setCourierCompany(CourierCompany.valueOf(orderDTO.getCourierCompany().toUpperCase()));
        } else {
            newOrder.setCourierCompany(null);
        }

        // Ustawiamy numer przesyłki z frontendu
        newOrder.setShipmentNumber(orderDTO.getShipmentNumber());

        // Pająki
        List<OrderedSpider> orderedSpiders = orderDTO.getOrderedSpiders().stream()
                .map(itemDTO -> {
                    Spider spider = spiderRepository.findById(itemDTO.getSpiderId())
                            .orElseThrow(() -> new SpiderNotFoundException("Spider with id " + itemDTO.getSpiderId() + " not found."));
                    OrderedSpider orderedSpider = new OrderedSpider();
                    orderedSpider.setSpider(spider);
                    orderedSpider.setQuantity(itemDTO.getQuantity());
                    orderedSpider.setOrder(newOrder);
                    return orderedSpider;
                }).collect(Collectors.toList());

        // Aktualizacja stocków
        orderedSpiders.forEach(orderedSpider -> {
            Spider spider = orderedSpider.getSpider();
            int orderedQuantity = orderedSpider.getQuantity();
            int currentQuantity = spider.getQuantity();

            if (currentQuantity < orderedQuantity) {
                throw new RuntimeException("Not enough stock for spider: " + spider.getSpeciesName());
            }
            spider.setQuantity(currentQuantity - orderedQuantity);
            spiderRepository.save(spider);
        });

        newOrder.setOrderedSpiders(orderedSpiders);

        // Cena z frontendu lub automatyczna
        if (orderDTO.getPrice() != null) {
            newOrder.setPrice(orderDTO.getPrice());
        } else {
            double totalPrice = orderedSpiders.stream()
                    .mapToDouble(os -> os.getSpider().getPrice() * os.getQuantity())
                    .sum();
            newOrder.setPrice(totalPrice);
        }

        return orderRepository.save(newOrder);
    }


    @Transactional
    public Order updateOrder(UUID id, OrderDTO orderDTO) {

        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order with id " + id + " not found."));

    /* ============================================================
       STATUS
    ============================================================ */
        if (orderDTO.getStatus() != null) {
            OrderStatus newStatus = OrderStatus.valueOf(orderDTO.getStatus().toUpperCase());

            // Jeśli zmiana na CANCELLED → zwrot stocków
            if (existingOrder.getStatus() != OrderStatus.CANCELLED &&
                    newStatus == OrderStatus.CANCELLED) {

                existingOrder.getOrderedSpiders().forEach(orderedSpider -> {
                    Spider spider = spiderRepository.findById(orderedSpider.getSpider().getId())
                            .orElseThrow(() -> new SpiderNotFoundException(
                                    "Spider with id " + orderedSpider.getSpider().getId() + " not found."
                            ));

                    spider.setQuantity(spider.getQuantity() + orderedSpider.getQuantity());
                    spiderRepository.save(spider);
                });
            }

            existingOrder.setStatus(newStatus);
        }

    /* ============================================================
       KLIENT
    ============================================================ */
        if (orderDTO.getCustomerId() != null &&
                !orderDTO.getCustomerId().equals(existingOrder.getCustomer().getId())) {

            Customer customer = customerService.getCustomerById(orderDTO.getCustomerId());
            if (customer == null) {
                throw new CustomerNotFoundException("Customer with id " + orderDTO.getCustomerId() + " not found.");
            }

            existingOrder.setCustomer(customer);
        }

    /* ============================================================
       KURIER
    ============================================================ */
        if (orderDTO.getCourierCompany() != null && !orderDTO.getCourierCompany().isBlank()) {
            try {
                existingOrder.setCourierCompany(
                        CourierCompany.valueOf(orderDTO.getCourierCompany().toUpperCase())
                );
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid courierCompany: " + orderDTO.getCourierCompany());
            }
        } else {
            existingOrder.setCourierCompany(null);
        }

    /* ============================================================
       NUMER PRZESYŁKI
    ============================================================ */
        if (orderDTO.getShipmentNumber() != null) {
            existingOrder.setShipmentNumber(orderDTO.getShipmentNumber());
        }

    /* ============================================================
       PAJĄKI
    ============================================================ */
        if (orderDTO.getOrderedSpiders() != null) {

            // Usuwamy stare pozycje
            existingOrder.getOrderedSpiders().clear();

            List<OrderedSpider> updatedSpiders = orderDTO.getOrderedSpiders().stream()
                    .map(itemDTO -> {
                        Spider spider = spiderRepository.findById(itemDTO.getSpiderId())
                                .orElseThrow(() -> new SpiderNotFoundException(
                                        "Spider with id " + itemDTO.getSpiderId() + " not found."
                                ));

                        OrderedSpider orderedSpider = new OrderedSpider();
                        orderedSpider.setSpider(spider);
                        orderedSpider.setQuantity(itemDTO.getQuantity());
                        orderedSpider.setOrder(existingOrder);

                        return orderedSpider;
                    })
                    .collect(Collectors.toList());

            existingOrder.getOrderedSpiders().addAll(updatedSpiders);
        }

    /* ============================================================
       CENA
    ============================================================ */
        if (orderDTO.getPrice() != null) {
            existingOrder.setPrice(orderDTO.getPrice());
        } else {
            double totalPrice = existingOrder.getOrderedSpiders().stream()
                    .mapToDouble(os -> os.getSpider().getPrice() * os.getQuantity())
                    .sum();
            existingOrder.setPrice(totalPrice);
        }

        return orderRepository.save(existingOrder);
    }

     /* ============================================================
       ANULUJ ZAMÓWIENIE
    ============================================================ */

    @Transactional
    public void cancelOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (order.getStatus() == OrderStatus.CANCELLED) return;

        // zwróć pająki do magazynu
        for (OrderedSpider os : order.getOrderedSpiders()) {
            Spider sp = os.getSpider();
            sp.setQuantity(sp.getQuantity() + os.getQuantity());
            spiderRepository.save(sp);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }


    public void deleteOrder(UUID id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException("Order with id " + id + " not found.");
        }
        orderRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(int page, int size, Sort sort) {
        Pageable pageable = PageRequest.of(page, size, sort);
        return orderRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Order> findById(UUID id) {
        return orderRepository.findById(id);
    }
}