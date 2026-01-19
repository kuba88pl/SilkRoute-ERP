package com.silkroute_erp.breeding.beta.controller;

import com.silkroute_erp.breeding.beta.entity.BreedingSpider;
import com.silkroute_erp.breeding.beta.service.BreedingSpiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/breeding/spiders")
public class BreedingSpiderController {

    @Autowired
    private BreedingSpiderService spiderService;

    @GetMapping
    public List<BreedingSpider> getAll() {
        return spiderService.getAll();
    }

    @GetMapping("/{id}")
    public BreedingSpider get(@PathVariable UUID id) {
        return spiderService.getById(id);
    }

    @PostMapping
    public BreedingSpider create(@RequestBody BreedingSpider spider) {
        return spiderService.create(spider);
    }

    @PutMapping("/{id}")
    public BreedingSpider update(@PathVariable UUID id, @RequestBody BreedingSpider spider) {
        return spiderService.update(id, spider);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        spiderService.delete(id);
    }
}

