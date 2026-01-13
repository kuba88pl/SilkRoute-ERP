package com.silkroute_erp.sales.dto;

import java.util.UUID;

public class OrderedSpiderDTO {
    private UUID spiderId;
    private int quantity;
    private SpiderDTO spider;

    public OrderedSpiderDTO() {
    }

    public OrderedSpiderDTO(UUID spiderId, int quantity, SpiderDTO spider) {
        this.spiderId = spiderId;
        this.quantity = quantity;
        this.spider = spider;
    }

    public UUID getSpiderId() {
        return spiderId;
    }

    public void setSpiderId(UUID spiderId) {
        this.spiderId = spiderId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public SpiderDTO getSpider() {
        return spider;
    }

    public void setSpider(SpiderDTO spider) {
        this.spider = spider;
    }
}