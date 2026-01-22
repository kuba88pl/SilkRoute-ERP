package com.silkroute_erp.sales.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "price")
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @Column(name = "shipment_number")
    private String shipmentNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "courier_company")
    private CourierCompany courierCompany;

    @Column(name = "self_collection")
    private Boolean selfCollection = false;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderedSpider> orderedSpiders = new ArrayList<>();

    public Order() {
        this.date = LocalDate.now();
        this.status = OrderStatus.NEW;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }

    public CourierCompany getCourierCompany() { return courierCompany; }
    public void setCourierCompany(CourierCompany courierCompany) { this.courierCompany = courierCompany; }

    public Boolean getSelfCollection() { return selfCollection; }
    public void setSelfCollection(Boolean selfCollection) { this.selfCollection = selfCollection; }

    public List<OrderedSpider> getOrderedSpiders() { return orderedSpiders; }
    public void setOrderedSpiders(List<OrderedSpider> orderedSpiders) { this.orderedSpiders = orderedSpiders; }
}
