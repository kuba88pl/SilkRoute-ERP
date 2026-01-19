package com.WMS_spiders_wholesale_system;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.entity.*;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.OrderRepository;
import com.silkroute_erp.sales.repository.SpiderRepository;
import com.silkroute_erp.sales.service.CustomerService;
import com.silkroute_erp.sales.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private SpiderRepository spiderRepository;
    @Mock
    private CustomerService customerService;

    @InjectMocks
    private OrderService orderService;

    private UUID orderId;
    private UUID customerId;
    private UUID spiderId1;
    private UUID spiderId2;
    private Customer testCustomer;
    private Spider spider1;
    private Spider spider2;
    private OrderDTO orderDTO;
    private Order existingOrder;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();
        customerId = UUID.randomUUID();
        spiderId1 = UUID.randomUUID();
        spiderId2 = UUID.randomUUID();

        testCustomer = new Customer();
        testCustomer.setId(customerId);

        spider1 = new Spider();
        spider1.setId(spiderId1);
        spider1.setQuantity(20);
        spider1.setPrice(10.0);
        spider1.setSpeciesName("Spider A");

        spider2 = new Spider();
        spider2.setId(spiderId2);
        spider2.setQuantity(5);
        spider2.setPrice(50.0);
        spider2.setSpeciesName("Spider B");



        orderDTO = new OrderDTO();
        orderDTO.setCustomerId(customerId);
        orderDTO.setShipmentNumber("SN123");
        orderDTO.setCourierCompany("DPD");

        OrderedSpider orderedSpider1 = new OrderedSpider();
        orderedSpider1.setSpider(spider1);
        orderedSpider1.setQuantity(5);

        existingOrder = new Order();
        existingOrder.setId(orderId);
        existingOrder.setCustomer(testCustomer);
        existingOrder.setStatus(OrderStatus.NEW);
        existingOrder.setOrderedSpiders(List.of(orderedSpider1));
        existingOrder.setCourierCompany(CourierCompany.DPD);
        existingOrder.setPrice(50.0);
    }


    @Test
    void createOrder_Success_CalculatesPrice() {
        // ARRANGE
        when(customerService.getCustomerById(customerId)).thenReturn(testCustomer);
        when(spiderRepository.findById(spiderId1)).thenReturn(Optional.of(spider1));
        when(spiderRepository.findById(spiderId2)).thenReturn(Optional.of(spider2));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]); // Zwraca przekazany obiekt

        // ACT
        Order createdOrder = orderService.createOrder(orderDTO);

        // ASSERT
        assertNotNull(createdOrder);
        assertEquals(OrderStatus.NEW, createdOrder.getStatus());
        assertEquals(CourierCompany.DPD, createdOrder.getCourierCompany());
        assertEquals(orderDTO.getShipmentNumber(), createdOrder.getShipmentNumber());

        assertEquals(70.0, createdOrder.getPrice());

        ArgumentCaptor<Spider> spiderCaptor = ArgumentCaptor.forClass(Spider.class);
        verify(spiderRepository, times(2)).save(spiderCaptor.capture());

        assertEquals(18, spiderCaptor.getAllValues().get(0).getQuantity());

        assertEquals(4, spiderCaptor.getAllValues().get(1).getQuantity());

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_Success_UsesProvidedPrice() {
        // ARRANGE
        orderDTO.setPrice(150.0); // Ustawienie ceny z DTO

        when(customerService.getCustomerById(customerId)).thenReturn(testCustomer);
        when(spiderRepository.findById(spiderId1)).thenReturn(Optional.of(spider1));
        when(spiderRepository.findById(spiderId2)).thenReturn(Optional.of(spider2));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        Order createdOrder = orderService.createOrder(orderDTO);

        // ASSERT
        assertEquals(150.0, createdOrder.getPrice()); // Sprawdzenie, czy użyto ceny z DTO
        verify(orderRepository, times(1)).save(any(Order.class));
    }



    @Test
    void createOrder_ThrowsSpiderNotFoundException() {
        // ARRANGE
        when(customerService.getCustomerById(customerId)).thenReturn(testCustomer);
        when(spiderRepository.findById(spiderId1)).thenReturn(Optional.empty()); // Brak pająka

        // ACT & ASSERT
        assertThrows(SpiderNotFoundException.class, () -> orderService.createOrder(orderDTO));

        verify(orderRepository, times(0)).save(any(Order.class));
        verify(spiderRepository, times(0)).save(any(Spider.class));
    }

    @Test
    void createOrder_ThrowsRuntimeException_NotEnoughStock() {
        // ARRANGE
        spider1.setQuantity(1);
        when(customerService.getCustomerById(customerId)).thenReturn(testCustomer);
        when(spiderRepository.findById(spiderId1)).thenReturn(Optional.of(spider1));

        when(spiderRepository.findById(spiderId2)).thenReturn(Optional.of(spider2));

        // ACT & ASSERT
        assertThrows(RuntimeException.class, () -> orderService.createOrder(orderDTO),
                "Oczekiwano wyjątku o braku wystarczającej ilości na stanie.");

        verify(orderRepository, times(0)).save(any(Order.class));
    }


    @Test
    void updateOrder_Success_UpdateStatusAndCustomer() {
        // ARRANGE
        UUID newCustomerId = UUID.randomUUID();
        Customer newCustomer = new Customer();
        newCustomer.setId(newCustomerId);

        OrderDTO updateDTO = new OrderDTO();
        updateDTO.setStatus(OrderStatus.SHIPPED.name());
        updateDTO.setCustomerId(newCustomerId);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(existingOrder));
        when(customerService.getCustomerById(newCustomerId)).thenReturn(newCustomer);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        Order result = orderService.updateOrder(orderId, updateDTO);

        // ASSERT
        assertEquals(OrderStatus.SHIPPED, result.getStatus());
        assertEquals(newCustomerId, result.getCustomer().getId());

        verify(orderRepository, times(1)).findById(orderId);
        verify(orderRepository, times(1)).save(existingOrder);
        verify(spiderRepository, never()).save(any(Spider.class)); // Sprawdzenie, czy nie ma zwrotu stanów
    }

    @Test
    void updateOrder_Success_CancelOrder_ReturnsStock() {
        // ARRANGE
        OrderDTO cancelDTO = new OrderDTO();
        cancelDTO.setStatus(OrderStatus.CANCELLED.name());

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(existingOrder));
        when(spiderRepository.findById(spiderId1)).thenReturn(Optional.of(spider1));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        Order result = orderService.updateOrder(orderId, cancelDTO);

        // ASSERT
        assertEquals(OrderStatus.CANCELLED, result.getStatus());

        ArgumentCaptor<Spider> spiderCaptor = ArgumentCaptor.forClass(Spider.class);
        verify(spiderRepository, times(1)).save(spiderCaptor.capture());
        assertEquals(25, spiderCaptor.getValue().getQuantity());
    }

    @Test
    void updateOrder_ThrowsOrderNotFoundException() {
        // ARRANGE
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(OrderNotFoundException.class, () -> orderService.updateOrder(orderId, new OrderDTO()));

        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void updateOrder_Success_SetsSelfCollection() {
        // ARRANGE
        OrderDTO updateDTO = new OrderDTO();
        updateDTO.setCourierCompany(""); // Puste, co ustawia selfCollection na true

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(existingOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        Order result = orderService.updateOrder(orderId, updateDTO);

        // ASSERT
        assertNull(result.getCourierCompany());
    }


    @Test
    void deleteOrder_Success() {
        // ARRANGE
        when(orderRepository.existsById(orderId)).thenReturn(true);
        doNothing().when(orderRepository).deleteById(orderId);

        // ACT
        orderService.deleteOrder(orderId);

        // ASSERT
        verify(orderRepository, times(1)).existsById(orderId);
        verify(orderRepository, times(1)).deleteById(orderId);
    }

    @Test
    void deleteOrder_ThrowsOrderNotFoundException() {
        // ARRANGE
        when(orderRepository.existsById(orderId)).thenReturn(false);

        // ACT & ASSERT
        assertThrows(OrderNotFoundException.class, () -> orderService.deleteOrder(orderId));

        verify(orderRepository, times(1)).existsById(orderId);
        verify(orderRepository, never()).deleteById(any(UUID.class));
    }


    @Test
    void findById_Success_ReturnsOrder() {
        // ARRANGE
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(existingOrder));

        // ACT
        Optional<Order> result = orderService.findById(orderId);

        // ASSERT
        assertTrue(result.isPresent());
        assertEquals(orderId, result.get().getId());
        verify(orderRepository, times(1)).findById(orderId);
    }

    @Test
    void findById_NotFound_ReturnsEmptyOptional() {
        // ARRANGE
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // ACT
        Optional<Order> result = orderService.findById(orderId);

        // ASSERT
        assertFalse(result.isPresent());
        verify(orderRepository, times(1)).findById(orderId);
    }


    @Test
    void getAllOrders_ReturnsPageOfOrders() {
        // ARRANGE
        int page = 0;
        int size = 10;
        Sort sort = Sort.by("date").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        List<Order> orderList = List.of(existingOrder);
        Page<Order> expectedPage = new PageImpl<>(orderList, pageable, 1);

        when(orderRepository.findAll(pageable)).thenReturn(expectedPage);

        // ACT
        Page<Order> result = orderService.getAllOrders(page, size, sort);

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(0, result.getNumber());
        verify(orderRepository, times(1)).findAll(pageable);
    }
}