package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.BreedingReport;
import com.silkroute_erp.breeding.repository.BreedingReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BreedingReportService {

    private final BreedingReportRepository breedingReportRepository;

    public List<BreedingReport> getAllReports() {
        return breedingReportRepository.findAll();
    }

    public BreedingReport getReportById(UUID id) {
        return breedingReportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report with id " + id + " not found"));
    }

    public BreedingReport createReport(BreedingReport breedingReport) {
        return breedingReportRepository.save(breedingReport);
    }

    @Transactional
    public BreedingReport updateReport(UUID id, BreedingEntry entry) {
        BreedingReport report = getReportById(id);
        report.getEntries().add(entry);

        return breedingReportRepository.save(report);
    }

    @Transactional
    public BreedingReport addEntryToReport(UUID id, BreedingEntry entry) {
        BreedingReport report = breedingReportRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Report with id " + id + " not found"));
        report.getEntries().add(entry);
        return breedingReportRepository.save(report);
    }

    public void deleteReport(UUID id) {
        breedingReportRepository.deleteById(id);
    }

}
