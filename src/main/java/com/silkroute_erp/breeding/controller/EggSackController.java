package com.silkroute_erp.breeding.controller;

import com.silkroute_erp.breeding.dto.EggSackCreateDTO;
import com.silkroute_erp.breeding.dto.EggSackDTO;
import com.silkroute_erp.breeding.dto.EggSackUpdateDTO;
import com.silkroute_erp.breeding.service.EggSackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/breeding")
@RequiredArgsConstructor
public class EggSackController {

    private final EggSackService eggSackService;

    /* ============================================================
       CREATE — POST /entries/{entryId}/eggsack
    ============================================================ */
    @PostMapping("/entries/{entryId}/eggsack")
    public EggSackDTO createEggSack(
            @PathVariable UUID entryId,
            @RequestBody EggSackCreateDTO dto
    ) {
        return eggSackService.createEggSack(entryId, dto);
    }

    /* ============================================================
       GET — GET /eggsack/{id}
    ============================================================ */
    @GetMapping("/eggsack/{id}")
    public EggSackDTO getEggSack(@PathVariable UUID id) throws Throwable {
        return eggSackService.getEggSack(id);
    }

    /* ============================================================
       GET BY ENTRY — GET /entries/{entryId}/eggsack
    ============================================================ */
    @GetMapping("/entries/{entryId}/eggsack")
    public EggSackDTO getEggSackByEntry(@PathVariable UUID entryId) {
        return eggSackService.getEggSackByEntry(entryId);
    }

    /* ============================================================
       UPDATE — PUT /eggsack/{id}
    ============================================================ */
    @PutMapping("/eggsack/{id}")
    public EggSackDTO updateEggSack(
            @PathVariable UUID id,
            @RequestBody EggSackUpdateDTO dto
    ) throws Throwable {
        return eggSackService.updateEggSack(id, dto);
    }

    /* ============================================================
       DELETE — DELETE /eggsack/{id}
    ============================================================ */
    @DeleteMapping("/eggsack/{id}")
    public void deleteEggSack(@PathVariable UUID id) throws Throwable {
        eggSackService.deleteEggSack(id);
    }
}
