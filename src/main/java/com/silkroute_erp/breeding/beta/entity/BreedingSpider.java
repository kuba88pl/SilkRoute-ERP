package com.silkroute_erp.breeding.beta.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "breeding_spider")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class BreedingSpider {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "type_name")
    private String typeName;

    @Column(name = "species_name")
    private String speciesName;

    @Column(name = "last_molt_date")
    private LocalDate lastMoltDate;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "origin")
    private String origin;

    @Column(name = "breeding_status")
    private String breedingStatus;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "breeding_count")
    private Integer breedingCount;

    @Column(name = "size")
    private String size;

    @Column(name = "is_cites")
    private boolean isCites;

    @Column(name = "cites_document_number")
    private String citesDocumentNumber;

    @OneToMany(mappedBy = "breedingSpider", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BreedingEntry> breedingEntryList;

    public BreedingSpider() {}

    /* ===== GETTERY / SETTERY ===== */

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public String getSpeciesName() { return speciesName; }
    public void setSpeciesName(String speciesName) { this.speciesName = speciesName; }

    public LocalDate getLastMoltDate() { return lastMoltDate; }
    public void setLastMoltDate(LocalDate lastMoltDate) { this.lastMoltDate = lastMoltDate; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getBreedingStatus() { return breedingStatus; }
    public void setBreedingStatus(String breedingStatus) { this.breedingStatus = breedingStatus; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getBreedingCount() { return breedingCount; }
    public void setBreedingCount(Integer breedingCount) { this.breedingCount = breedingCount; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public boolean isCites() { return isCites; }
    public void setCites(boolean cites) { isCites = cites; }

    public String getCitesDocumentNumber() { return citesDocumentNumber; }
    public void setCitesDocumentNumber(String citesDocumentNumber) { this.citesDocumentNumber = citesDocumentNumber; }

    public List<BreedingEntry> getBreedingEntryList() { return breedingEntryList; }
    public void setBreedingEntryList(List<BreedingEntry> breedingEntryList) { this.breedingEntryList = breedingEntryList; }
}
