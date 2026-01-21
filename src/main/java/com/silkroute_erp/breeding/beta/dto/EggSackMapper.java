package com.silkroute_erp.breeding.beta.mapper;

import com.silkroute_erp.breeding.beta.dto.EggSackCreateDTO;
import com.silkroute_erp.breeding.beta.dto.EggSackDTO;
import com.silkroute_erp.breeding.beta.dto.EggSackUpdateDTO;
import com.silkroute_erp.breeding.beta.entity.BreedingEntry;
import com.silkroute_erp.breeding.beta.entity.EggSack;

public class EggSackMapper {

    /* ============================================================
       ENTITY → DTO
    ============================================================ */
    public static EggSackDTO toDTO(EggSack entity) {
        if (entity == null) return null;

        EggSackDTO dto = new EggSackDTO();
        dto.setId(entity.getId());
        dto.setDateOfEggSack(entity.getDateOfEggSack());
        dto.setSuggestedDateOfEggSackPull(entity.getSuggestedDateOfEggSackPull());
        dto.setDateOfEggSackPull(entity.getDateOfEggSackPull());
        dto.setNumberOfEggs(entity.getNumberOfEggs());
        dto.setNumberOfBadEggs(entity.getNumberOfBadEggs());
        dto.setNumberOfNymphs(entity.getNumberOfNymphs());
        dto.setNumberOfDeadNymphs(entity.getNumberOfDeadNymphs());
        dto.setNumberOfSpiders(entity.getNumberOfSpiders());
        dto.setNumberOfDeadSpiders(entity.getNumberOfDeadSpiders());
        dto.setEggSackDescription(entity.getEggSackDescription());
        dto.setStatus(entity.getStatus());

        if (entity.getEntry() != null) {
            dto.setEntryId(entity.getEntry().getId());
        }

        return dto;
    }

    /* ============================================================
       CREATE DTO → ENTITY
    ============================================================ */
    public static EggSack fromCreateDTO(EggSackCreateDTO dto, BreedingEntry entry) {
        EggSack entity = new EggSack();

        entity.setDateOfEggSack(dto.getDateOfEggSack());
        entity.setSuggestedDateOfEggSackPull(dto.getSuggestedDateOfEggSackPull());
        entity.setDateOfEggSackPull(dto.getDateOfEggSackPull());
        entity.setNumberOfEggs(dto.getNumberOfEggs());
        entity.setNumberOfBadEggs(dto.getNumberOfBadEggs());
        entity.setNumberOfNymphs(dto.getNumberOfNymphs());
        entity.setNumberOfDeadNymphs(dto.getNumberOfDeadNymphs());
        entity.setNumberOfSpiders(dto.getNumberOfSpiders());
        entity.setNumberOfDeadSpiders(dto.getNumberOfDeadSpiders());
        entity.setEggSackDescription(dto.getEggSackDescription());
        entity.setStatus(dto.getStatus());

        entity.setEntry(entry);

        return entity;
    }

    /* ============================================================
       UPDATE DTO → ENTITY (nadpisuje istniejący)
    ============================================================ */
    public static void updateEntity(EggSack entity, EggSackUpdateDTO dto) {
        entity.setDateOfEggSack(dto.getDateOfEggSack());
        entity.setSuggestedDateOfEggSackPull(dto.getSuggestedDateOfEggSackPull());
        entity.setDateOfEggSackPull(dto.getDateOfEggSackPull());
        entity.setNumberOfEggs(dto.getNumberOfEggs());
        entity.setNumberOfBadEggs(dto.getNumberOfBadEggs());
        entity.setNumberOfNymphs(dto.getNumberOfNymphs());
        entity.setNumberOfDeadNymphs(dto.getNumberOfDeadNymphs());
        entity.setNumberOfSpiders(dto.getNumberOfSpiders());
        entity.setNumberOfDeadSpiders(dto.getNumberOfDeadSpiders());
        entity.setEggSackDescription(dto.getEggSackDescription());
        entity.setStatus(dto.getStatus());
    }
}
