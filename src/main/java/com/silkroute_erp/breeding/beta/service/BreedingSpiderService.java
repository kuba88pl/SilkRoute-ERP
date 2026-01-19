package com.silkroute_erp.breeding.beta.service;

import com.silkroute_erp.breeding.beta.entity.BreedingSpider;
import com.silkroute_erp.breeding.beta.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.beta.repository.BreedingSpiderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BreedingSpiderService {

    @Autowired
    private BreedingSpiderRepository spiderRepo;

    @Autowired
    private BreedingEntryRepository entryRepo;

    public List<BreedingSpider> getAll() {
        return spiderRepo.findAll();
    }

    public BreedingSpider getById(UUID id) {
        return spiderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Spider not found"));
    }

    public BreedingSpider create(BreedingSpider spider) {
        spider.setBreedingCount(0);
        return spiderRepo.save(spider);
    }

    public BreedingSpider update(UUID id, BreedingSpider updated) {
        BreedingSpider existing = getById(id);

        existing.setTypeName(updated.getTypeName());
        existing.setSpeciesName(updated.getSpeciesName());
        existing.setLastMoltDate(updated.getLastMoltDate());
        existing.setBirthDate(updated.getBirthDate());
        existing.setOrigin(updated.getOrigin());
        existing.setBreedingStatus(updated.getBreedingStatus());
        existing.setNotes(updated.getNotes());
        existing.setSize(updated.getSize());
        existing.setCites(updated.isCites());
        existing.setCitesDocumentNumber(updated.getCitesDocumentNumber());

        return spiderRepo.save(existing);
    }

    public void delete(UUID id) {
        spiderRepo.deleteById(id);
    }
}


