package com.silkroute_erp.breeding.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "breeding_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreedingReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String speciesName;

    private String femaleId;
    private String maleId;

    private LocalDate matingDate;
    private LocalDate eggsackDate;

    private Double averageTemperature;

    @Enumerated(EnumType.STRING)
    private BreedingStatus status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "report_id")
    private List<BreedingEntry> entries = new ArrayList<>();

}
