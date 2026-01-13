package com.silkroute_erp.sales.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "orders")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Order implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "price")
    private double price;

//    @Column(name = "new_price")
//    private double newPrice;

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

    public Order() {
        this.date = LocalDate.now();
        this.status = OrderStatus.NEW;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<OrderedSpider> getOrderedSpiders() {
        return orderedSpiders;
    }

    public void setOrderedSpiders(List<OrderedSpider> orderedSpiders) {
        this.orderedSpiders = orderedSpiders;
    }

    public void addOrderedSpider(OrderedSpider spider) {
        this.orderedSpiders.add(spider);
        spider.setOrder(this);
    }

    public String getShipmentNumber() {
        return shipmentNumber;
    }

    public void setShipmentNumber(String shipmentNumber) {
        this.shipmentNumber = shipmentNumber;
    }

    public CourierCompany getCourierCompany() {
        return courierCompany;
    }

    public void setCourierCompany(CourierCompany courierCompany) {
        this.courierCompany = courierCompany;
    }

    public Boolean getSelfCollection() {
        return selfCollection;
    }

    public void setSelfCollection(Boolean selfCollection) {
        this.selfCollection = selfCollection;
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderedSpider> orderedSpiders = new ArrayList<>();


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Double.compare(price, order.price) == 0 && Objects.equals(id, order.id) && Objects.equals(customer, order.customer) && Objects.equals(date, order.date) && status == order.status;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customer, date, price, status);
    }
}