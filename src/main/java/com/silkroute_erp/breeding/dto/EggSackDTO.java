package com.silkroute_erp.breeding.dto;

import com.silkroute_erp.breeding.entity.EggSackStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class EggSackDTO {
    private UUID id;
    private LocalDate dateOfEggSack;
    private LocalDate suggestedDateOfEggSackPull;
    private LocalDate dateOfEggSackPull;
    private Integer numberOfEggs;
    private Integer numberOfBadEggs;
    private Integer numberOfNymphs;
    private Integer numberOfDeadNymphs;
    private Integer numberOfSpiders;
    private Integer numberOfDeadSpiders;
    private String eggSackDescription;
    private EggSackStatus status;
    private UUID entryId;
}
