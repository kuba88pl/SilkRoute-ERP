package com.silkroute_erp.breeding.beta.dto;

import com.silkroute_erp.breeding.beta.entity.EggSackStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EggSackUpdateDTO {
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
}
