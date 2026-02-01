package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.dto.OrderedSpiderDTO;
import com.silkroute_erp.sales.entity.*;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.OrderRepository;
import com.silkroute_erp.sales.repository.SpiderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    private OrderRepository orderRepository;
    private SpiderRepository spiderRepository;
    private CustomerService customerService;
    private OrderService service;

    @BeforeEach
    void setup() {
        orderRepository = mock(OrderRepository.class);
        spiderRepository = mock(SpiderRepository.class);
        customerService = mock(CustomerService.class);
        service = new OrderService(orderRepository, spiderRepository, customerService);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void createOrder_createsOrderAndReducesStock() {
        UUID customerId = UUID.randomUUID();
        UUID spiderId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Spider spider = new Spider();
        spider.setId(spiderId);
        spider.setQuantity(10);
        spider.setPrice(100.0);

        OrderedSpiderDTO itemDTO = new OrderedSpiderDTO();
        itemDTO.setSpiderId(spiderId);
        itemDTO.setQuantity(2);

        OrderDTO dto = new OrderDTO();
        dto.setCustomerId(customerId);
        dto.setOrderedSpiders(List.of(itemDTO));

        when(customerService.getCustomerById(customerId)).thenReturn(customer);
        when(spiderRepository.findById(spiderId)).thenReturn(Optional.of(spider));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Order result = service.createOrder(dto);

        assertNotNull(result);
        assertEquals(customer, result.getCustomer());
        assertEquals(1, result.getOrderedSpiders().size());
        assertEquals(8, spider.getQuantity()); // stock reduced
        assertEquals(200.0, result.getPrice());

        verify(spiderRepository).save(spider);
        verify(orderRepository).save(result);
    }

    @Test
    void createOrder_throwsWhenCustomerNotFound() {
        UUID customerId = UUID.randomUUID();
        OrderDTO dto = new OrderDTO();
        dto.setCustomerId(customerId);

        when(customerService.getCustomerById(customerId)).thenThrow(new CustomerNotFoundException(""));

        assertThrows(CustomerNotFoundException.class, () -> service.createOrder(dto));
    }

    @Test
    void createOrder_throwsWhenSpiderNotFound() {
        UUID customerId = UUID.randomUUID();
        UUID spiderId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        OrderedSpiderDTO itemDTO = new OrderedSpiderDTO();
        itemDTO.setSpiderId(spiderId);
        itemDTO.setQuantity(1);

        OrderDTO dto = new OrderDTO();
        dto.setCustomerId(customerId);
        dto.setOrderedSpiders(List.of(itemDTO));

        when(customerService.getCustomerById(customerId)).thenReturn(customer);
        when(spiderRepository.findById(spiderId)).thenReturn(Optional.empty());

        assertThrows(SpiderNotFoundException.class, () -> service.createOrder(dto));
    }

    @Test
    void createOrder_throwsWhenNotEnoughStock() {
        UUID customerId = UUID.randomUUID();
        UUID spiderId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Spider spider = new Spider();
        spider.setId(spiderId);
        spider.setQuantity(1);

        OrderedSpiderDTO itemDTO = new OrderedSpiderDTO();
        itemDTO.setSpiderId(spiderId);
        itemDTO.setQuantity(5);

        OrderDTO dto = new OrderDTO();
        dto.setCustomerId(customerId);
        dto.setOrderedSpiders(List.of(itemDTO));

        when(customerService.getCustomerById(customerId)).thenReturn(customer);
        when(spiderRepository.findById(spiderId)).thenReturn(Optional.of(spider));

        assertThrows(RuntimeException.class, () -> service.createOrder(dto));
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateOrder_updatesStatusAndRestoresStockOnCancel() {
        UUID orderId = UUID.randomUUID();

        Spider spider = new Spider();
        spider.setQuantity(5);
        spider.setPrice(100.0);

        OrderedSpider os = new OrderedSpider();
        os.setSpider(spider);
        os.setQuantity(2);

        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.NEW);
        order.setOrderedSpiders(List.of(os));

        OrderDTO dto = new OrderDTO();
        dto.setStatus("CANCELLED");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        Order result = service.updateOrder(orderId, dto);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        assertEquals(7, spider.getQuantity()); // stock restored

        verify(spiderRepository).save(spider);
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrder_throwsWhenOrderNotFound() {
        UUID id = UUID.randomUUID();
        OrderDTO dto = new OrderDTO();

        when(orderRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> service.updateOrder(id, dto));
    }

    // ============================================================
    // CANCEL
    // ============================================================

    @Test
    void cancelOrder_restoresStockAndSetsStatus() {
        UUID orderId = UUID.randomUUID();

        Spider spider = new Spider();
        spider.setQuantity(3);

        OrderedSpider os = new OrderedSpider();
        os.setSpider(spider);
        os.setQuantity(2);

        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.NEW);
        order.setOrderedSpiders(List.of(os));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        service.cancelOrder(orderId);

        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        assertEquals(5, spider.getQuantity());

        verify(spiderRepository).save(spider);
        verify(orderRepository).save(order);
    }

    @Test
    void cancelOrder_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(orderRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> service.cancelOrder(id));
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteOrder_deletesWhenExists() {
        UUID id = UUID.randomUUID();

        when(orderRepository.existsById(id)).thenReturn(true);

        service.deleteOrder(id);

        verify(orderRepository).deleteById(id);
    }

    @Test
    void deleteOrder_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();

        when(orderRepository.existsById(id)).thenReturn(false);

        assertThrows(OrderNotFoundException.class, () -> service.deleteOrder(id));
    }

    // ============================================================
    // GET ALL
    // ============================================================

    @Test
    void getAllOrdersNoPagination_returnsList() {
        List<Order> list = List.of(new Order(), new Order());

        when(orderRepository.findAll(any(Sort.class))).thenReturn(list);

        List<Order> result = service.getAllOrdersNoPagination();

        assertEquals(2, result.size());
    }

    // ============================================================
    // FIND BY ID
    // ============================================================

    @Test
    void findById_returnsOptional() {
        UUID id = UUID.randomUUID();
        Order order = new Order();
        order.setId(id);

        when(orderRepository.findById(id)).thenReturn(Optional.of(order));

        Optional<Order> result = service.findById(id);

        assertTrue(result.isPresent());
    }
}
