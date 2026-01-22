package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.entity.Spider;
import com.silkroute_erp.sales.exception.InvalidSpiderDataException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.SpiderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SpiderService {

    private final SpiderRepository spiderRepository;

    public SpiderService(SpiderRepository spiderRepository) {
        this.spiderRepository = spiderRepository;
    }

    /* ============================================================
       CREATE
    ============================================================ */
    public Spider addSpider(Spider spider) {
        if (spider == null ||
                spider.getSpeciesName() == null ||
                spider.getSpeciesName().trim().isEmpty()) {
            throw new InvalidSpiderDataException("Spider species name cannot be null or empty.");
        }

        return spiderRepository.save(spider);
    }

    /* ============================================================
       UPDATE
    ============================================================ */
    public Spider updateSpider(Spider spider) {
        if (spider == null || spider.getId() == null) {
            throw new InvalidSpiderDataException("Spider and its ID cannot be null for an update.");
        }

        if (!spiderRepository.existsById(spider.getId())) {
            throw new SpiderNotFoundException("Spider with ID " + spider.getId() + " not found.");
        }

        return spiderRepository.save(spider);
    }

    /* ============================================================
       DELETE
    ============================================================ */
    public void deleteSpider(UUID id) {
        if (!spiderRepository.existsById(id)) {
            throw new SpiderNotFoundException("Spider with ID " + id + " not found.");
        }
        spiderRepository.deleteById(id);
    }

    /* ============================================================
       FINDERS
    ============================================================ */
    public Spider getSpiderById(UUID id) {
        return spiderRepository.findById(id)
                .orElseThrow(() ->
                        new SpiderNotFoundException("Spider with ID " + id + " not found.")
                );
    }

    public List<Spider> getSpiderBySpeciesName(String speciesName) {
        List<Spider> spiders = spiderRepository.findBySpeciesName(speciesName);
        if (spiders.isEmpty()) {
            throw new SpiderNotFoundException("No spiders found with species name: " + speciesName);
        }
        return spiders;
    }

    /* ============================================================
       FULL LIST
    ============================================================ */
    public List<Spider> getAllSpidersNoPagination() {
        return spiderRepository.findAllByOrderBySpeciesNameAsc();
    }
}
