package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.entity.BreedingSpider;
import com.silkroute_erp.breeding.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.repository.BreedingSpiderRepository;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@AutoConfigureMockMvc(addFilters = false)

@Service
public class BreedingSpiderServiceTest {

    private final BreedingSpiderRepository spiderRepo;
    private final BreedingEntryRepository entryRepo;

    public BreedingSpiderServiceTest(BreedingSpiderRepository spiderRepo,
                                 BreedingEntryRepository entryRepo) {
        this.spiderRepo = spiderRepo;
        this.entryRepo = entryRepo;
    }

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
