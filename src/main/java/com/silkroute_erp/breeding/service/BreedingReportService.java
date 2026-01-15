package com.silkroute_erp.breeding.service;

import com.silkroute_erp.breeding.entity.BreedingEntry;
import com.silkroute_erp.breeding.entity.BreedingReport;
import com.silkroute_erp.breeding.entity.BreedingStatus;
import com.silkroute_erp.breeding.repository.BreedingReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;

import java.time.LocalDate;
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
        return breedingReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report with id " + id + " not found"));
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
        BreedingReport report = breedingReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report with id " + id + " not found"));
        report.getEntries().add(entry);
        return breedingReportRepository.save(report);
    }

    public LocalDate estimateHatchDate(UUID id) {
        BreedingReport breedingReport = breedingReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report with id " + id + " not found"));
        if (breedingReport.getEggsackDate() == null) {
            return null;
        }

        long incubationPeriod = 30;

        if (breedingReport.getAverageTemperature() != null && breedingReport.getAverageTemperature() < 25.0) {
            incubationPeriod += 3;
        }

        return breedingReport.getEggsackDate().plusDays(incubationPeriod);
    }

    @Transactional
    public BreedingReport pullEggsack(UUID id, LocalDate pullDate) {
        BreedingReport breedingReport = breedingReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report with id " + id + " not found"));
        if (breedingReport.getEggsackDate() == null) {
            throw new IllegalStateException("Błąd: Nie mozesz odebrać kokonu, jeśli nie ma daty jego złożenia!");
        }

        if (pullDate.isBefore(breedingReport.getEggsackDate())) {
            throw new IllegalStateException("Błąd: Data odbioru kokonu nie może być wcześniejsza niż dada złożenia!");
        }

        breedingReport.setEggsackDate(pullDate);
        breedingReport.setStatus(BreedingStatus.IN_INCUBATION);
        return breedingReportRepository.save(breedingReport);
    }

    public void deleteReport(UUID id) {
        breedingReportRepository.deleteById(id);
    }

}
