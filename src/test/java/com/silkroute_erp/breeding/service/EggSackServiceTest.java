package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.dto.EggSackCreateDTO;
import com.silkroute_erp.breeding.dto.EggSackDTO;
import com.silkroute_erp.breeding.dto.EggSackUpdateDTO;
import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.EggSack;
import com.silkroute_erp.breeding.dto.EggSackMapper;
import com.silkroute_erp.breeding.repository.BreedingEntryRepository;
import com.silkroute_erp.breeding.repository.EggSackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EggSackServiceTest {

    private EggSackRepository eggSackRepository;
    private BreedingEntryRepository breedingEntryRepository;
    private EggSackService service;

    @BeforeEach
    void setup() {
        eggSackRepository = mock(EggSackRepository.class);
        breedingEntryRepository = mock(BreedingEntryRepository.class);
        service = new EggSackService(eggSackRepository, breedingEntryRepository);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void createEggSack_createsNewEggSack() {
        UUID entryId = UUID.randomUUID();

        BreedingEntry entry = new BreedingEntry();
        entry.setEggSack(null);

        EggSackCreateDTO dto = new EggSackCreateDTO();
        EggSack mapped = EggSackMapper.fromCreateDTO(dto, entry);

        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.of(entry));
        when(eggSackRepository.save(any())).thenReturn(mapped);

        EggSackDTO result = service.createEggSack(entryId, dto);

        assertNotNull(result);
        assertEquals(mapped.getId(), result.getId());
        assertEquals(mapped.getEntry(), entry);

        verify(eggSackRepository).save(any(EggSack.class));
        verify(breedingEntryRepository).save(entry);
    }

    @Test
    void createEggSack_throwsWhenEntryNotFound() {
        UUID entryId = UUID.randomUUID();
        EggSackCreateDTO dto = new EggSackCreateDTO();

        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.createEggSack(entryId, dto));
    }

    @Test
    void createEggSack_throwsWhenEntryAlreadyHasEggSack() {
        UUID entryId = UUID.randomUUID();

        BreedingEntry entry = new BreedingEntry();
        entry.setEggSack(new EggSack());

        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.of(entry));

        assertThrows(IllegalStateException.class, () -> service.createEggSack(entryId, new EggSackCreateDTO()));
    }

    // ============================================================
    // GET
    // ============================================================

    @Test
    void getEggSack_returnsEggSack() throws Throwable {
        UUID id = UUID.randomUUID();
        EggSack sack = new EggSack();
        sack.setId(id);

        when(eggSackRepository.findById(id)).thenReturn(Optional.of(sack));

        EggSackDTO result = service.getEggSack(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    void getEggSack_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(eggSackRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getEggSack(id));
    }

    // ============================================================
    // GET BY ENTRY
    // ============================================================

    @Test
    void getEggSackByEntry_returnsEggSack() {
        UUID entryId = UUID.randomUUID();

        EggSack sack = new EggSack();
        BreedingEntry entry = new BreedingEntry();
        entry.setEggSack(sack);

        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.of(entry));

        EggSackDTO result = service.getEggSackByEntry(entryId);

        assertNotNull(result);
    }

    @Test
    void getEggSackByEntry_returnsNullWhenNoEggSack() {
        UUID entryId = UUID.randomUUID();

        BreedingEntry entry = new BreedingEntry();
        entry.setEggSack(null);

        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.of(entry));

        EggSackDTO result = service.getEggSackByEntry(entryId);

        assertNull(result);
    }

    @Test
    void getEggSackByEntry_throwsWhenEntryNotFound() {
        UUID entryId = UUID.randomUUID();
        when(breedingEntryRepository.findById(entryId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getEggSackByEntry(entryId));
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateEggSack_updatesEntity() throws Throwable {
        UUID id = UUID.randomUUID();

        EggSack existing = new EggSack();
        existing.setId(id);

        EggSackUpdateDTO dto = new EggSackUpdateDTO();

        when(eggSackRepository.findById(id)).thenReturn(Optional.of(existing));
        when(eggSackRepository.save(existing)).thenReturn(existing);

        EggSackDTO result = service.updateEggSack(id, dto);

        assertNotNull(result);
        verify(eggSackRepository).save(existing);
    }

    @Test
    void updateEggSack_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        EggSackUpdateDTO dto = new EggSackUpdateDTO();

        when(eggSackRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.updateEggSack(id, dto));
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteEggSack_deletesEntityAndUnlinksEntry() throws Throwable {
        UUID id = UUID.randomUUID();

        EggSack sack = new EggSack();
        sack.setId(id);

        BreedingEntry entry = new BreedingEntry();
        entry.setEggSack(sack);
        sack.setEntry(entry);

        when(eggSackRepository.findById(id)).thenReturn(Optional.of(sack));

        service.deleteEggSack(id);

        assertNull(entry.getEggSack());
        verify(breedingEntryRepository).save(entry);
        verify(eggSackRepository).delete(sack);
    }

    @Test
    void deleteEggSack_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        when(eggSackRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.deleteEggSack(id));
    }
}
