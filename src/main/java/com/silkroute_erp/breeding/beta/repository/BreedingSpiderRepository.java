package com.silkroute_erp.breeding.beta.repository;

import com.silkroute_erp.breeding.beta.entity.BreedingSpider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BreedingSpiderRepository extends JpaRepository<BreedingSpider, UUID> {
}
