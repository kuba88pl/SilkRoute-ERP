package com.silkroute_erp.sales.controller;

import com.silkroute_erp.sales.dto.SpiderDTO;
import com.silkroute_erp.sales.dto.SpiderMapper;
import com.silkroute_erp.sales.entity.Spider;
import com.silkroute_erp.sales.exception.InvalidSpiderDataException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.service.SpiderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.UUID;

@RestController
@RequestMapping("api/spiders")
public class SpiderController {
    private static final Logger logger = LoggerFactory.getLogger(SpiderController.class);

    private final SpiderService spiderService;

    public SpiderController(SpiderService spiderService) {
        this.spiderService = spiderService;
    }

    @PostMapping
    public ResponseEntity<SpiderDTO> addSpider(@RequestBody SpiderDTO spiderDTO) {
        try {
            Spider newSpider = spiderService.addSpider(SpiderMapper.toEntity(spiderDTO));
            return ResponseEntity.status(HttpStatus.CREATED).body(SpiderMapper.toDTO(newSpider));
        } catch (InvalidSpiderDataException e) {
            logger.error("Invalid spider data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred while adding spider", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<SpiderDTO> updateSpider(@PathVariable UUID id, @RequestBody SpiderDTO spiderDTO) {
        try {
            Spider updatedSpider = spiderService.updateSpider(SpiderMapper.toEntity(spiderDTO));
            return ResponseEntity.ok(SpiderMapper.toDTO(updatedSpider));
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (InvalidSpiderDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred while updating spider", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpider(@PathVariable UUID id) {
        try {
            spiderService.deleteSpider(id);
            return ResponseEntity.noContent().build();
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<SpiderDTO>> getAllSpiders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "speciesName") String sortBy) {

        var spidersPage = spiderService.getAllSpiders(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(SpiderMapper.toDTOPage(spidersPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpiderDTO> getSpiderById(@PathVariable UUID id) {
        try {
            Spider spider = spiderService.getSpiderById(id);
            return ResponseEntity.ok(SpiderMapper.toDTO(spider));
        } catch (SpiderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}