package com.silkroute_erp.breeding.beta.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "egg_sack")
public class EggSack {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;
    @Column(name ="created_at")
    private LocalDate createdAt;
    @Column(name ="updated_at")
    private LocalDate updatedAt;
    @Column(name = "date_of_eggsack")
    private LocalDate dateOfEggSack;
    @Column(name = "suggested_date_of_eggsack_pull")
    private LocalDate suggestedDateOfEggSackPull;
    @Column(name = "date_of_eggsack_pull")
    private LocalDate dateOfEggSackPull;
    @Column(name = "number_of_eggs")
    private Integer numberOfEggs;
    @Column(name = "number_of_bad_eggs")
    private Integer numberOfBadEggs;
    @Column(name = "number_of_nymphs")
    private Integer numberOfNymphs;
    @Column(name = "number_of_dead_nymphs")
    private Integer numberOfDeadNymphs;
    @Column(name = "number_of_spiders")
    private Integer numberOfSpiders;
    @Column(name = "number_of_dead_spiders")
    private Integer numberOfDeadSpiders;
    @Column(name ="eggsack_description", columnDefinition = "TEXT")
    private String eggSackDescription;
    @OneToOne
    @JoinColumn(name = "entry_id")
    private BreedingEntry entry;
    @Enumerated(EnumType.STRING)
    private EggSackStatus status;

    @PrePersist
    public void prePersisty(){
        createdAt = LocalDate.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDate.now();
    }
}
