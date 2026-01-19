package com.silkroute_erp.breeding.beta.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class BreedingSpiderDTO {

    private UUID id;
    private String typeName;
    private String speciesName;
    private LocalDate lastMoltDate;
    private LocalDate birthDate;
    private String origin;
    private String breedingStatus;
    private String notes;
    private Integer breedingCount;
    private String size;
    private boolean isCites;
    private String citesDocumentNumber;

    private List<BreedingEntryDTO> breedingEntries;

    public BreedingSpiderDTO() {}

    /* GETTERY / SETTERY */
}
