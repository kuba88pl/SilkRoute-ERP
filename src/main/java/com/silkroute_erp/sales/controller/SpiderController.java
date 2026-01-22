package com.silkroute_erp.sales.controller;

import com.silkroute_erp.sales.dto.SpiderDTO;
import com.silkroute_erp.sales.dto.SpiderMapper;
import com.silkroute_erp.sales.entity.Spider;
import com.silkroute_erp.sales.exception.InvalidSpiderDataException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.service.SpiderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/spiders")
public class SpiderController {

    private final SpiderService spiderService;

    public SpiderController(SpiderService spiderService) {
        this.spiderService = spiderService;
    }

    @PostMapping
    public ResponseEntity<SpiderDTO> addSpider(@RequestBody SpiderDTO dto) {
        try {
            Spider saved = spiderService.addSpider(SpiderMapper.toEntity(dto));
            return ResponseEntity.status(HttpStatus.CREATED).body(SpiderMapper.toDTO(saved));
        } catch (InvalidSpiderDataException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpiderDTO> updateSpider(@PathVariable UUID id, @RequestBody SpiderDTO dto) {
        try {
            dto.setId(id);
            Spider updated = spiderService.updateSpider(SpiderMapper.toEntity(dto));
            return ResponseEntity.ok(SpiderMapper.toDTO(updated));
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InvalidSpiderDataException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpider(@PathVariable UUID id) {
        try {
            spiderService.deleteSpider(id);
            return ResponseEntity.noContent().build();
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<SpiderDTO>> getAllSpiders() {
        List<SpiderDTO> dtos = spiderService.getAllSpidersNoPagination()
                .stream()
                .map(SpiderMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpiderDTO> getSpiderById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(SpiderMapper.toDTO(spiderService.getSpiderById(id)));
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
