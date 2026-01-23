package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.dto.EggSackCreateDTO;
import com.silkroute_erp.breeding.dto.EggSackDTO;
import com.silkroute_erp.breeding.dto.EggSackUpdateDTO;
import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.EggSack;
import com.silkroute_erp.breeding.dto.EggSackMapper;
import com.silkroute_erp.breeding.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.repository.EggSackRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.UUID;
@Getter
@Setter
@Service
@RequiredArgsConstructor
public class EggSackService {

    private final EggSackRepository eggSackRepository;
    private final BreedingEntryRepository breedingEntryRepository;

    /* ============================================================
       CREATE — tworzenie kokonu dla wpisu rozmnożenia
    ============================================================ */
    public EggSackDTO createEggSack(UUID entryId, EggSackCreateDTO dto) {
        BreedingEntry entry = breedingEntryRepository.findById(entryId)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + entryId));

        if (entry.getEggSack() != null) {
            throw new IllegalStateException("This entry already has an egg sack assigned.");
        }

        EggSack entity = EggSackMapper.fromCreateDTO(dto, entry);
        eggSackRepository.save(entity);

        entry.setEggSack(entity);
        breedingEntryRepository.save(entry);

        return EggSackMapper.toDTO(entity);
    }

    /* ============================================================
       GET — pobranie kokonu po ID
    ============================================================ */
    public EggSackDTO getEggSack(UUID id) throws Throwable {
        EggSack entity = (EggSack) eggSackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Egg sack not found: " + id));

        return EggSackMapper.toDTO(entity);
    }

    /* ============================================================
       GET BY ENTRY — pobranie kokonu dla wpisu rozmnożenia
    ============================================================ */
    public EggSackDTO getEggSackByEntry(UUID entryId) {
        BreedingEntry entry = breedingEntryRepository.findById(entryId)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + entryId));

        if (entry.getEggSack() == null) {
            return null;
        }

        return EggSackMapper.toDTO(entry.getEggSack());
    }

    /* ============================================================
       UPDATE — edycja kokonu
    ============================================================ */
    public EggSackDTO updateEggSack(UUID id, EggSackUpdateDTO dto) throws Throwable {
        EggSack entity = (EggSack) eggSackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Egg sack not found: " + id));

        EggSackMapper.updateEntity(entity, dto);
        eggSackRepository.save(entity);

        return EggSackMapper.toDTO(entity);
    }

    /* ============================================================
       DELETE — usunięcie kokonu
    ============================================================ */
    public void deleteEggSack(UUID id) throws Throwable {
        EggSack entity = (EggSack) eggSackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Egg sack not found: " + id));

        BreedingEntry entry = entity.getEntry();
        if (entry != null) {
            entry.setEggSack(null);
            breedingEntryRepository.save(entry);
        }

        eggSackRepository.delete(entity);
    }
}
