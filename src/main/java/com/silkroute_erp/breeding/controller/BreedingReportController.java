package com.silkroute_erp.breeding.controller;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.BreedingReport;
import com.silkroute_erp.breeding.service.BreedingReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/breeding")
@RequiredArgsConstructor
public class BreedingReportController {

    private final BreedingReportService breedingReportService;

    @GetMapping("/reports")
    public List<BreedingReport> getAllReports() {
        return this.breedingReportService.getAllReports();
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<BreedingReport> getReportById(@PathVariable UUID id) {
        return ResponseEntity.ok(breedingReportService.getReportById(id));
    }

    @PostMapping("/reports")
    public ResponseEntity<BreedingReport> createReport(@RequestBody BreedingReport breedingReport) {
        BreedingReport newReport = breedingReportService.createReport(breedingReport);
        return new ResponseEntity<>(newReport, HttpStatus.CREATED);
    }

    @PostMapping("/reports/{id}/entries")
    public ResponseEntity<BreedingReport> addEntry(
            @PathVariable UUID id,
            @RequestBody BreedingEntry breedingEntry) {
        return ResponseEntity.ok(breedingReportService.addEntryToReport(id, breedingEntry));
    }

    @PatchMapping("{id}/pull-eggsack")
    public ResponseEntity<?> pullEggsack(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pullDate) {
        try {
            BreedingReport updateReport = breedingReportService.pullEggsack(id, pullDate);
            return ResponseEntity.ok(updateReport);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Wystąpił nieoczekiwany błąd.");
        }
    }


    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deleteReportById(@PathVariable UUID id) {
        breedingReportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
