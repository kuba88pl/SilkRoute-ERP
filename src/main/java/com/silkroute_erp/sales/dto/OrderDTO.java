package com.silkroute_erp.sales.dto;

import java.util.List;
import java.util.UUID;

public class OrderDTO {

    private UUID id;
    private String date;
    private Double price;

    private String status;
    private String shipmentNumber;
    private String courierCompany;

    private UUID customerId;
    private CustomerDTO customer;

    private List<OrderedSpiderDTO> orderedSpiders;

    public OrderDTO() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }

    public String getCourierCompany() { return courierCompany; }
    public void setCourierCompany(String courierCompany) { this.courierCompany = courierCompany; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public CustomerDTO getCustomer() { return customer; }
    public void setCustomer(CustomerDTO customer) { this.customer = customer; }

    public List<OrderedSpiderDTO> getOrderedSpiders() { return orderedSpiders; }
    public void setOrderedSpiders(List<OrderedSpiderDTO> orderedSpiders) { this.orderedSpiders = orderedSpiders; }
}
