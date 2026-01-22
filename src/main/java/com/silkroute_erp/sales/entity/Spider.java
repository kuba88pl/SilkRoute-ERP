package com.silkroute_erp.sales.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "spiders")
public class Spider {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "type_name")
    private String typeName;

    @Column(name = "species_name")
    private String speciesName;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "size")
    private String size;

    @Column(name = "price")
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private SpiderGender gender;

    @Column(name = "is_cites")
    private boolean isCites;

    public Spider() {}

    public Spider(String typeName, String speciesName, int quantity, String size, double price, SpiderGender gender, boolean isCites) {
        this.typeName = typeName;
        this.speciesName = speciesName;
        this.quantity = quantity;
        this.size = size;
        this.price = price;
        this.gender = gender;
        this.isCites = isCites;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getSpeciesName() {
        return speciesName;
    }

    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public SpiderGender getGender() {
        return gender;
    }

    public void setGender(SpiderGender gender) {
        this.gender = gender;
    }

    public boolean isCites() {
        return isCites;
    }

    public void setCites(boolean cites) {
        isCites = cites;
    }
}
