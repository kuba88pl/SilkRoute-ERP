package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.entity.OrderedSpider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setDate(order.getDate().toString());
        orderDTO.setPrice(order.getPrice());
        orderDTO.setStatus(order.getStatus().toString());

        if (order.getCourierCompany() != null) {
            orderDTO.setCourierCompany(order.getCourierCompany().toString());
        } else {
            orderDTO.setCourierCompany(null);
        }

//        orderDTO.setSelfCollection(order.getSelfCollection());
        orderDTO.setShipmentNumber(order.getShipmentNumber());

        if (order.getCustomer() != null) {
            orderDTO.setCustomer(CustomerMapper.toDTO(order.getCustomer()));
        }

        if (order.getOrderedSpiders() != null) {
            orderDTO.setOrderedSpiders(order.getOrderedSpiders().stream()
                    .map(OrderMapper::toOrderItemDTO)
                    .collect(Collectors.toList()));
        }

        return orderDTO;
    }

    public static OrderedSpiderDTO toOrderItemDTO(OrderedSpider orderedSpider) {
        if (orderedSpider == null) {
            return null;
        }
        OrderedSpiderDTO orderedSpiderDTO = new OrderedSpiderDTO();
        orderedSpiderDTO.setSpiderId(orderedSpider.getSpider().getId());
        orderedSpiderDTO.setQuantity(orderedSpider.getQuantity());
        orderedSpiderDTO.setSpider(SpiderMapper.toDTO(orderedSpider.getSpider()));

        return orderedSpiderDTO;
    }

    public static Page<OrderDTO> toDTOPage(Page<Order> orders) {
        if (orders == null) {
            return Page.empty();
        }
        return new PageImpl<>(
                orders.getContent().stream()
                        .map(OrderMapper::toDTO)
                        .collect(Collectors.toList()),
                orders.getPageable(),
                orders.getTotalElements()
        );
    }
}