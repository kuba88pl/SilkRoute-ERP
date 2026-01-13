package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.entity.Spider;
import com.silkroute_erp.sales.exception.InvalidSpiderDataException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.SpiderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SpiderService {

    private final SpiderRepository spiderRepository;

    public SpiderService(SpiderRepository spiderRepository) {
        this.spiderRepository = spiderRepository;
    }

    public Spider addSpider(Spider spider) throws InvalidSpiderDataException {
        if (spider == null || spider.getSpeciesName() == null || spider.getSpeciesName().trim().isEmpty()) {
            throw new InvalidSpiderDataException("Spider species name cannot be null or empty.");
        }
        if (spider.getId() != null && spiderRepository.existsById(spider.getId())) {
            throw new InvalidSpiderDataException("Spider with this ID already exists.");
        }
        return spiderRepository.save(spider);
    }

    public Spider updateSpider(Spider spider) throws SpiderNotFoundException, InvalidSpiderDataException {
        if (spider == null || spider.getId() == null) {
            throw new InvalidSpiderDataException("Spider and its ID cannot be null for an update.");
        }
        if (!spiderRepository.existsById(spider.getId())) {
            throw new SpiderNotFoundException("Spider with ID " + spider.getId() + " not found.");
        }
        return spiderRepository.save(spider);
    }

    public void deleteSpider(UUID id) throws SpiderNotFoundException {
        if (!spiderRepository.existsById(id)) {
            throw new SpiderNotFoundException("Spider with ID " + id + " not found.");
        }
        spiderRepository.deleteById(id);
    }

    public Spider getSpiderById(UUID id) throws SpiderNotFoundException {
        return spiderRepository.findById(id)
                .orElseThrow(() -> new SpiderNotFoundException("Spider with ID " + id + " not found."));
    }

    public List<Spider> getSpiderBySpeciesName(String speciesName) throws SpiderNotFoundException {
        List<Spider> spiders = spiderRepository.findBySpeciesName(speciesName);
        if (spiders.isEmpty()) {
            throw new SpiderNotFoundException("No spiders found with species name: " + speciesName);
        }
        return spiders;
    }

    public Page<Spider> getAllSpiders(int page, int size, Sort sort) {
        return spiderRepository.findAll(PageRequest.of(page, size, sort));
    }
}