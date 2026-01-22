package com.silkroute_erp.sales.controller;

import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.dto.OrderMapper;
import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto) {
        try {
            Order saved = orderService.createOrder(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(OrderMapper.toDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> dtos = orderService.getAllOrdersNoPagination()
                .stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable UUID id) {
        return orderService.findById(id)
                .map(order -> ResponseEntity.ok(OrderMapper.toDTO(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable UUID id, @RequestBody OrderDTO dto) {
        try {
            Order updated = orderService.updateOrder(id, dto);
            return ResponseEntity.ok(OrderMapper.toDTO(updated));
        } catch (OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID id) {
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.noContent().build();
        } catch (OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
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
