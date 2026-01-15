package com.silkroute_erp.breeding.repository;

import com.silkroute_erp.breeding.entity.BreedingReport;
import com.silkroute_erp.breeding.entity.BreedingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BreedingReportRepository extends JpaRepository<BreedingReport, UUID> {
    List<BreedingReport> findBySpeciesNameIgnoreCase(String speciesName);

    List<BreedingReport> findByStatus(BreedingStatus status);

    List<BreedingReport> findByFemaleId(String femaleId);

    UUID id(UUID id);
}
