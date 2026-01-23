package com.silkroute_erp.breeding.repository;

import com.silkroute_erp.breeding.entity.EggSack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EggSackRepository extends JpaRepository<EggSack, UUID> {
}
