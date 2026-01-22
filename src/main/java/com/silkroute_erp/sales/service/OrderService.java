package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.dto.OrderedSpiderDTO;
import com.silkroute_erp.sales.dto.OrderedSpiderMapper;
import com.silkroute_erp.sales.entity.*;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.OrderRepository;
import com.silkroute_erp.sales.repository.SpiderRepository;
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

    public OrderService(OrderRepository orderRepository,
                        SpiderRepository spiderRepository,
                        CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.spiderRepository = spiderRepository;
        this.customerService = customerService;
    }

    /* ============================================================
       CREATE
    ============================================================ */
    @Transactional
    public Order createOrder(OrderDTO dto) {

        Customer customer = customerService.getCustomerById(dto.getCustomerId());
        if (customer == null) {
            throw new CustomerNotFoundException("Customer not found");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setDate(LocalDate.now());
        order.setStatus(dto.getStatus() != null
                ? OrderStatus.valueOf(dto.getStatus().toUpperCase())
                : OrderStatus.NEW);

        if (dto.getCourierCompany() != null && !dto.getCourierCompany().isBlank()) {
            order.setCourierCompany(CourierCompany.valueOf(dto.getCourierCompany().toUpperCase()));
        }

        order.setShipmentNumber(dto.getShipmentNumber());

        // Ordered spiders
        List<OrderedSpider> items = dto.getOrderedSpiders().stream()
                .map(itemDTO -> {
                    Spider spider = spiderRepository.findById(itemDTO.getSpiderId())
                            .orElseThrow(() -> new SpiderNotFoundException("Spider not found"));

                    if (spider.getQuantity() < itemDTO.getQuantity()) {
                        throw new RuntimeException("Not enough stock for spider: " + spider.getSpeciesName());
                    }

                    spider.setQuantity(spider.getQuantity() - itemDTO.getQuantity());
                    spiderRepository.save(spider);

                    OrderedSpider os = new OrderedSpider();
                    os.setSpider(spider);
                    os.setQuantity(itemDTO.getQuantity());
                    os.setOrder(order);
                    return os;
                })
                .collect(Collectors.toList());

        order.setOrderedSpiders(items);

        // Price
        if (dto.getPrice() != null) {
            order.setPrice(dto.getPrice());
        } else {
            double total = items.stream()
                    .mapToDouble(os -> os.getSpider().getPrice() * os.getQuantity())
                    .sum();
            order.setPrice(total);
        }

        return orderRepository.save(order);
    }

    /* ============================================================
       UPDATE
    ============================================================ */
    @Transactional
    public Order updateOrder(UUID id, OrderDTO dto) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        // Status
        if (dto.getStatus() != null) {
            OrderStatus newStatus = OrderStatus.valueOf(dto.getStatus().toUpperCase());

            if (order.getStatus() != OrderStatus.CANCELLED &&
                    newStatus == OrderStatus.CANCELLED) {

                for (OrderedSpider os : order.getOrderedSpiders()) {
                    Spider spider = os.getSpider();
                    spider.setQuantity(spider.getQuantity() + os.getQuantity());
                    spiderRepository.save(spider);
                }
            }

            order.setStatus(newStatus);
        }

        // Customer
        if (dto.getCustomerId() != null &&
                !dto.getCustomerId().equals(order.getCustomer().getId())) {

            Customer customer = customerService.getCustomerById(dto.getCustomerId());
            order.setCustomer(customer);
        }

        // Courier
        if (dto.getCourierCompany() != null && !dto.getCourierCompany().isBlank()) {
            order.setCourierCompany(CourierCompany.valueOf(dto.getCourierCompany().toUpperCase()));
        } else {
            order.setCourierCompany(null);
        }

        order.setShipmentNumber(dto.getShipmentNumber());

        // Ordered spiders
        if (dto.getOrderedSpiders() != null) {

            // return stock from old items
            for (OrderedSpider os : order.getOrderedSpiders()) {
                Spider spider = os.getSpider();
                spider.setQuantity(spider.getQuantity() + os.getQuantity());
                spiderRepository.save(spider);
            }

            order.getOrderedSpiders().clear();

            List<OrderedSpider> updated = dto.getOrderedSpiders().stream()
                    .map(itemDTO -> {
                        Spider spider = spiderRepository.findById(itemDTO.getSpiderId())
                                .orElseThrow(() -> new SpiderNotFoundException("Spider not found"));

                        if (spider.getQuantity() < itemDTO.getQuantity()) {
                            throw new RuntimeException("Not enough stock for spider: " + spider.getSpeciesName());
                        }

                        spider.setQuantity(spider.getQuantity() - itemDTO.getQuantity());
                        spiderRepository.save(spider);

                        OrderedSpider os = new OrderedSpider();
                        os.setSpider(spider);
                        os.setQuantity(itemDTO.getQuantity());
                        os.setOrder(order);
                        return os;
                    })
                    .collect(Collectors.toList());

            order.getOrderedSpiders().addAll(updated);
        }

        // Price
        if (dto.getPrice() != null) {
            order.setPrice(dto.getPrice());
        } else {
            double total = order.getOrderedSpiders().stream()
                    .mapToDouble(os -> os.getSpider().getPrice() * os.getQuantity())
                    .sum();
            order.setPrice(total);
        }

        return orderRepository.save(order);
    }

    /* ============================================================
       CANCEL
    ============================================================ */
    @Transactional
    public void cancelOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (order.getStatus() == OrderStatus.CANCELLED) return;

        for (OrderedSpider os : order.getOrderedSpiders()) {
            Spider spider = os.getSpider();
            spider.setQuantity(spider.getQuantity() + os.getQuantity());
            spiderRepository.save(spider);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    /* ============================================================
       DELETE
    ============================================================ */
    public void deleteOrder(UUID id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    /* ============================================================
       FULL LIST
    ============================================================ */
    public List<Order> getAllOrdersNoPagination() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    /* ============================================================
       FIND BY ID
    ============================================================ */
    public Optional<Order> findById(UUID id) {
        return orderRepository.findById(id);
    }
}
