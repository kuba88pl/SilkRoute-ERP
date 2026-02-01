package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.BreedingSpider;
import com.silkroute_erp.breeding.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.repository.BreedingSpiderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BreedingEntryServiceTest {

    private final BreedingEntryRepository entryRepo;
    private final BreedingSpiderRepository spiderRepo;

    public BreedingEntryServiceTest(BreedingEntryRepository entryRepo,
                                BreedingSpiderRepository spiderRepo) {
        this.entryRepo = entryRepo;
        this.spiderRepo = spiderRepo;
    }

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

        if (entry.getBehaviorNotes() == null) {
            entry.setBehaviorNotes("");
        }

        spider.setBreedingCount(spider.getBreedingCount() + 1);

        return entryRepo.save(entry);
    }

    public BreedingEntry update(UUID id, BreedingEntry updated) {
        BreedingEntry existing = entryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        // Kopulacje
        if (updated.getPairingDate1() != null) existing.setPairingDate1(updated.getPairingDate1());
        if (updated.getPairingDate2() != null) existing.setPairingDate2(updated.getPairingDate2());
        if (updated.getPairingDate3() != null) existing.setPairingDate3(updated.getPairingDate3());
        if (updated.getPairingDate4() != null) existing.setPairingDate4(updated.getPairingDate4());

        if (updated.getPairingTemperature() != null) existing.setPairingTemperature(updated.getPairingTemperature());
        if (updated.getPairingHumidity() != null) existing.setPairingHumidity(updated.getPairingHumidity());
        if (updated.getPairingNotes() != null) existing.setPairingNotes(updated.getPairingNotes());

        // Kokon
        if (updated.getSacDate() != null) existing.setSacDate(updated.getSacDate());
        if (updated.getRecommendedPullDate() != null) existing.setRecommendedPullDate(updated.getRecommendedPullDate());

        if (updated.getTotalEggsOrNymphs() != null) existing.setTotalEggsOrNymphs(updated.getTotalEggsOrNymphs());
        if (updated.getDeadCount() != null) existing.setDeadCount(updated.getDeadCount());
        if (updated.getLiveL1Count() != null) existing.setLiveL1Count(updated.getLiveL1Count());
        if (updated.getCocoonStatus() != null) existing.setCocoonStatus(updated.getCocoonStatus());

        // Uwagi behawioralne
        if (updated.getBehaviorNotes() != null) existing.setBehaviorNotes(updated.getBehaviorNotes());

        // Notatki ogólne
        if (updated.getNotes() != null) existing.setNotes(updated.getNotes());

        existing.setUpdatedAt(LocalDate.now());

        return entryRepo.save(existing);
    }

    public void delete(UUID id) {
        entryRepo.deleteById(id);
    }
}
