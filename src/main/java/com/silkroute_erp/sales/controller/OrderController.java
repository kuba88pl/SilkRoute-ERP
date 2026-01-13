package com.silkroute_erp.sales.controller;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.dto.OrderMapper;
import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        logger.info("Received request to create a new order.");
        try {
            Order newOrder = orderService.createOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toDTO(newOrder));
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Page<Order> orders = orderService.getAllOrders(page, size, sort);
        Page<OrderDTO> orderDTOs = orders.map(OrderMapper::toDTO);
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable UUID id) {
        return orderService.findById(id)
                .map(order -> ResponseEntity.ok(OrderMapper.toDTO(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Nowa metoda do kompleksowej aktualizacji zamówienia
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable UUID id, @RequestBody OrderDTO orderDTO) {
        try {
            logger.info("Received request to update order with ID: {}", id);
            Order updatedOrder = orderService.updateOrder(id, orderDTO);
            return ResponseEntity.ok(OrderMapper.toDTO(updatedOrder));
        } catch (OrderNotFoundException e) {
            logger.warn("Order not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred while updating order: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}