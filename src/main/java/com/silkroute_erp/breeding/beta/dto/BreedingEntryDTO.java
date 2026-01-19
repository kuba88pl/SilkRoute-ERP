package com.silkroute_erp.breeding.beta.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class BreedingEntryDTO {

    private UUID id;
    private UUID breedingSpiderId;

    private LocalDate pairingDate1;
    private LocalDate pairingDate2;
    private LocalDate pairingDate3;
    private LocalDate pairingDate4;

    private Double pairingTemperature;
    private Double pairingHumidity;
    private String pairingNotes;

    private LocalDate sacDate;
    private LocalDate recommendedPullDate;

    private Integer totalEggsOrNymphs;
    private Integer deadCount;
    private Integer liveL1Count;

    private String cocoonStatus;

    private List<BehaviorNoteDTO> behaviorNotes;

    private String notes;

    private LocalDate createdAt;
    private LocalDate updatedAt;

    public static class BehaviorNoteDTO {
        private LocalDate date;
        private String content;
    }
}
