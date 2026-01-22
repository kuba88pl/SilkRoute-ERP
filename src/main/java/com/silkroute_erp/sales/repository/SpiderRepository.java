package com.silkroute_erp.sales.repository;

import com.silkroute_erp.sales.entity.Spider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpiderRepository extends JpaRepository<Spider, UUID> {

    List<Spider> findBySpeciesName(String speciesName);

    // Used by SpiderService.getAllSpidersNoPagination()
    List<Spider> findAllByOrderBySpeciesNameAsc();
}
