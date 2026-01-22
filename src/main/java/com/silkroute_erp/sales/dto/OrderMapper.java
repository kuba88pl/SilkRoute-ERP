package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.entity.OrderedSpider;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setDate(order.getDate().toString());
        dto.setPrice(order.getPrice());
        dto.setStatus(order.getStatus().toString());
        dto.setShipmentNumber(order.getShipmentNumber());

        dto.setCourierCompany(
                order.getCourierCompany() != null ? order.getCourierCompany().toString() : null
        );

        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getId());
            dto.setCustomer(CustomerMapper.toDTO(order.getCustomer()));
        }

        if (order.getOrderedSpiders() != null) {
            dto.setOrderedSpiders(
                    order.getOrderedSpiders().stream()
                            .map(OrderMapper::toOrderItemDTO)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public static OrderedSpiderDTO toOrderItemDTO(OrderedSpider orderedSpider) {
        OrderedSpiderDTO dto = new OrderedSpiderDTO();
        dto.setSpiderId(orderedSpider.getSpider().getId());
        dto.setQuantity(orderedSpider.getQuantity());
        dto.setSpider(SpiderMapper.toDTO(orderedSpider.getSpider()));
        return dto;
    }
}
