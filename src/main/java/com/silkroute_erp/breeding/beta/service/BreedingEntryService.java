package com.silkroute_erp.breeding.beta.service;

import com.silkroute_erp.breeding.beta.entity.BreedingEntry;
import com.silkroute_erp.breeding.beta.entity.BreedingSpider;
import com.silkroute_erp.breeding.beta.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.beta.repository.BreedingSpiderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BreedingEntryService {

    @Autowired
    private BreedingEntryRepository entryRepo;

    @Autowired
    private BreedingSpiderRepository spiderRepo;

    public List<BreedingEntry> getAllForSpider(UUID spiderId) {
        BreedingSpider spider = spiderRepo.findById(spiderId)
                .orElseThrow(() -> new RuntimeException("Spider not found"));

        return spider.getBreedingEntryList();
    }

    public BreedingEntry create(UUID spiderId, BreedingEntry entry) {
        BreedingSpider spider = spiderRepo.findById(spiderId)
                .orElseThrow(() -> new RuntimeException("Spider not found"));

        entry.setId(UUID.randomUUID());
        entry.setBreedingSpider(spider);
        entry.setCreatedAt(LocalDate.now());
        entry.setUpdatedAt(LocalDate.now());

        spider.setBreedingCount(spider.getBreedingCount() + 1);

        return entryRepo.save(entry);
    }

    public BreedingEntry update(UUID id, BreedingEntry updated) {
        BreedingEntry existing = entryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        existing.setPairingDate1(updated.getPairingDate1());
        existing.setPairingDate2(updated.getPairingDate2());
        existing.setPairingDate3(updated.getPairingDate3());
        existing.setPairingDate4(updated.getPairingDate4());

        existing.setPairingTemperature(updated.getPairingTemperature());
        existing.setPairingHumidity(updated.getPairingHumidity());
        existing.setPairingNotes(updated.getPairingNotes());

        existing.setSacDate(updated.getSacDate());
        existing.setRecommendedPullDate(updated.getRecommendedPullDate());

        existing.setTotalEggsOrNymphs(updated.getTotalEggsOrNymphs());
        existing.setDeadCount(updated.getDeadCount());
        existing.setLiveL1Count(updated.getLiveL1Count());
        existing.setCocoonStatus(updated.getCocoonStatus());

        existing.setBehaviorNotes(updated.getBehaviorNotes());
        existing.setNotes(updated.getNotes());
        existing.setUpdatedAt(LocalDate.now());

        return entryRepo.save(existing);
    }

    public void delete(UUID id) {
        entryRepo.deleteById(id);
    }
}
