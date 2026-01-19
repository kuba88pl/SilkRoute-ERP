package com.silkroute_erp.breeding.beta.dto;

import java.util.UUID;

public class BreedingSpiderDTO {
    private UUID id;
    private String typeName;
    private String speciesName;
    private String size;
    private boolean isCites;
    private String citesDocumentNumber;

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

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public boolean isCites() {
        return isCites;
    }

    public void setCites(boolean cites) {
        isCites = cites;
    }

    public String getCitesDocumentNumber() {
        return citesDocumentNumber;
    }

    public void setCitesDocumentNumber(String citesDocumentNumber) {
        this.citesDocumentNumber = citesDocumentNumber;
    }
}
