package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.SpiderGender;

import java.util.UUID;

public class SpiderDTO {
    private UUID id;
    private String typeName;
    private String speciesName;
    private int quantity;
    private String size;
    private double price;
    private SpiderGender gender;
    private boolean isCites;

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
        String[] citesTypenames = {"Brachypelma", "Poecilotheria", "Tliltocatl"};
        for (String type : citesTypenames) {
            if (typeName.equalsIgnoreCase(type)) {
                isCites = true;
            }
        }

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

    public boolean isCites() {
        return isCites;
    }

    public void setCites(boolean cites) {
        isCites = cites;
    }

    public SpiderGender getGender() {
        return gender;
    }

    public void setGender(SpiderGender gender) {
        this.gender = gender;
    }
}