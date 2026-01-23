package com.silkroute_erp.breeding.repository;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BreedingEntryRepository extends JpaRepository<BreedingEntry, UUID> {
}
