package com.silkroute_erp.breeding.beta.repository;

import com.silkroute_erp.breeding.beta.entity.BreedingEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BreedingEntryRepository extends JpaRepository<BreedingEntry, UUID> {
}
