package com.silkroute_erp.sales.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.silkroute_erp.sales.dto.OrderDTO;
import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.exception.OrderNotFoundException;
import com.silkroute_erp.sales.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@AutoConfigureMockMvc(addFilters = false)

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderService orderService; // wstrzyknięty z konfiguracji

    @Autowired
    private ObjectMapper objectMapper;

    @Configuration
    static class TestConfig {

        @Bean
        public OrderService orderService() {
            return Mockito.mock(OrderService.class);
        }

        @Bean
        public OrderController orderController(OrderService orderService) {
            return new OrderController(orderService);
        }
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void createOrder_returnsCreated() throws Exception {
        OrderDTO dto = new OrderDTO();
        dto.setCustomerId(UUID.randomUUID());

        Order saved = new Order();
        saved.setId(UUID.randomUUID());

        Mockito.when(orderService.createOrder(any())).thenReturn(saved);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    void createOrder_returnsBadRequestOnException() throws Exception {
        Mockito.when(orderService.createOrder(any())).thenThrow(new RuntimeException());

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderDTO())))
                .andExpect(status().isBadRequest());
    }

    // ============================================================
    // GET ALL
    // ============================================================

    @Test
    void getAllOrders_returnsList() throws Exception {
        Order o1 = new Order();
        o1.setId(UUID.randomUUID());

        Order o2 = new Order();
        o2.setId(UUID.randomUUID());

        Mockito.when(orderService.getAllOrdersNoPagination())
                .thenReturn(List.of(o1, o2));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    @Test
    void getOrderById_returnsOrder() throws Exception {
        UUID id = UUID.randomUUID();
        Order order = new Order();
        order.setId(id);

        Mockito.when(orderService.findById(id)).thenReturn(Optional.of(order));

        mockMvc.perform(get("/api/orders/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    void getOrderById_returnsNotFound() throws Exception {
        UUID id = UUID.randomUUID();

        Mockito.when(orderService.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/orders/" + id))
                .andExpect(status().isNotFound());
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateOrder_returnsOk() throws Exception {
        UUID id = UUID.randomUUID();

        Order updated = new Order();
        updated.setId(id);

        Mockito.when(orderService.updateOrder(eq(id), any())).thenReturn(updated);

        mockMvc.perform(put("/api/orders/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderDTO())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    void updateOrder_returnsNotFound() throws Exception {
        UUID id = UUID.randomUUID();

        Mockito.when(orderService.updateOrder(eq(id), any()))
                .thenThrow(new OrderNotFoundException(""));

        mockMvc.perform(put("/api/orders/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderDTO())))
                .andExpect(status().isNotFound());
    }

    // ============================================================
    // CANCEL
    // ============================================================

    @Test
    void cancelOrder_returnsNoContent() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(post("/api/orders/" + id + "/cancel"))
                .andExpect(status().isNoContent());
    }

    @Test
    void cancelOrder_returnsNotFound() throws Exception {
        UUID id = UUID.randomUUID();

        Mockito.doThrow(new OrderNotFoundException(""))
                .when(orderService).cancelOrder(id);

        mockMvc.perform(post("/api/orders/" + id + "/cancel"))
                .andExpect(status().isNotFound());
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteOrder_returnsNoContent() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/orders/" + id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteOrder_returnsNotFound() throws Exception {
        UUID id = UUID.randomUUID();

        Mockito.doThrow(new OrderNotFoundException(""))
                .when(orderService).deleteOrder(id);

        mockMvc.perform(delete("/api/orders/" + id))
                .andExpect(status().isNotFound());
    }
}
