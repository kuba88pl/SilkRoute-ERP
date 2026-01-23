package com.silkroute_erp.breeding.repository;

import com.silkroute_erp.breeding.entity.BreedingSpider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BreedingSpiderRepository extends JpaRepository<BreedingSpider, UUID> {
}
