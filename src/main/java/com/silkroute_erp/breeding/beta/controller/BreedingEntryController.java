package com.silkroute_erp.breeding.beta.controller;

import com.silkroute_erp.breeding.beta.entity.BreedingEntry;
import com.silkroute_erp.breeding.beta.service.BreedingEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/breeding/entries")
public class BreedingEntryController {

    @Autowired
    private BreedingEntryService entryService;

    @GetMapping("/spider/{spiderId}")
    public List<BreedingEntry> getAllForSpider(@PathVariable UUID spiderId) {
        return entryService.getAllForSpider(spiderId);
    }

    @PostMapping("/spider/{spiderId}")
    public BreedingEntry create(@PathVariable UUID spiderId, @RequestBody BreedingEntry entry) {
        return entryService.create(spiderId, entry);
    }

    @PutMapping("/{id}")
    public BreedingEntry update(@PathVariable UUID id, @RequestBody BreedingEntry entry) {
        return entryService.update(id, entry);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        entryService.delete(id);
    }
}

