package com.silkroute_erp.breeding.beta.entity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "breeding_spider")
@JsonIdentityInfo( generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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
    @Column(name ="origin")
    //pochodzenie
    private String origin;
    @Column(name = "breeding_status")
    // np. ACTIVE, RESTING, RECOVERING, RETIRED
    private String breedingStatus;
    @Column (name ="notes", columnDefinition = "TEXT")
    //notatki
    private String notes;
    @Column(name="breeding_count")
    //ilość dotychczasowych rozmnożeń
    private Integer breedingCount;
    @Column(name = "size")
    private String size;
    @Column(name = "is_cites")
    private boolean isCites;
    @Column(name = "cites_document_number")
    private String citesDocumentNumber;

    @OneToMany(mappedBy = "breedingSpider", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BreedingEntry> breedingEntryList;

    public BreedingSpider() {
    }

    public BreedingSpider(UUID id, String typeName, String speciesName, String size, boolean isCites) {
        this.typeName = typeName;
        this.speciesName = speciesName;
        this.size = size;
        this.isCites = isCites;
    }

    public BreedingSpider(String typeName, String speciesName, String size, boolean isCites, String citesDocumentNumber) {
        this.typeName = typeName;
        this.speciesName = speciesName;
        this.size = size;
        this.isCites = isCites;
        this.citesDocumentNumber = citesDocumentNumber;
    }

    public String getTypeName() {
        return typeName;
    }

    public String getSpeciesName() {
        return speciesName;
    }

    public String getSize() {
        return size;
    }

    public boolean isCites() {
        return isCites;
    }

    public String getCitesDocumentNumber() {
        return citesDocumentNumber;
    }

    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public void setCites(boolean cites) {
        isCites = cites;
    }

    public void setCitesDocumentNumber(String citesDocumentNumber) {
        this.citesDocumentNumber = citesDocumentNumber;
    }
}
