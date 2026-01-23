package com.silkroute_erp.breeding.controller;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.service.BreedingEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/breeding/entries")
public class BreedingEntryController {

    @Autowired
    private BreedingEntryService entryService;

    /* ============================================================
       GET — wszystkie wpisy dla danego pająka
    ============================================================ */
    @GetMapping("/spider/{spiderId}")
    public List<BreedingEntry> getAllForSpider(@PathVariable UUID spiderId) {
        return entryService.getAllForSpider(spiderId);
    }

    /* ============================================================
       POST — tworzenie nowego wpisu hodowlanego
    ============================================================ */
    @PostMapping("/spider/{spiderId}")
    public BreedingEntry create(@PathVariable UUID spiderId, @RequestBody BreedingEntry entry) {
        return entryService.create(spiderId, entry);
    }

    /* ============================================================
       PUT — aktualizacja wpisu hodowlanego
    ============================================================ */
    @PutMapping("/{id}")
    public BreedingEntry update(@PathVariable UUID id, @RequestBody BreedingEntry entry) {
        return entryService.update(id, entry);
    }

    /* ============================================================
       DELETE — usuwanie wpisu hodowlanego
       (usuwa również kokon dzięki CascadeType.ALL + orphanRemoval)
    ============================================================ */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        entryService.delete(id);
    }
}
