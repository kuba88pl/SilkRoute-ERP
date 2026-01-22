package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.OrderedSpider;
import com.silkroute_erp.sales.entity.Spider;

public class OrderedSpiderMapper {

    public static OrderedSpiderDTO toDTO(OrderedSpider orderedSpider) {
        OrderedSpiderDTO dto = new OrderedSpiderDTO();
        dto.setSpiderId(orderedSpider.getSpider().getId());
        dto.setQuantity(orderedSpider.getQuantity());
        dto.setSpider(SpiderMapper.toDTO(orderedSpider.getSpider()));
        return dto;
    }

    public static OrderedSpider toEntity(OrderedSpiderDTO dto, Spider spider) {
        OrderedSpider entity = new OrderedSpider();
        entity.setSpider(spider);
        entity.setQuantity(dto.getQuantity());
        return entity;
    }
}
