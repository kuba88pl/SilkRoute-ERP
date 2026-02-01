package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.entity.Spider;
import com.silkroute_erp.sales.exception.InvalidSpiderDataException;
import com.silkroute_erp.sales.exception.SpiderNotFoundException;
import com.silkroute_erp.sales.repository.SpiderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SpiderServiceTest {

    private SpiderRepository spiderRepository;
    private SpiderService service;

    @BeforeEach
    void setup() {
        spiderRepository = mock(SpiderRepository.class);
        service = new SpiderService(spiderRepository);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void addSpider_savesSpider() {
        Spider spider = new Spider();
        spider.setSpeciesName("Caribena versicolor");

        when(spiderRepository.save(spider)).thenReturn(spider);

        Spider result = service.addSpider(spider);

        assertNotNull(result);
        verify(spiderRepository).save(spider);
    }

    @Test
    void addSpider_throwsWhenSpiderNull() {
        assertThrows(InvalidSpiderDataException.class, () -> service.addSpider(null));
    }

    @Test
    void addSpider_throwsWhenSpeciesNameMissing() {
        Spider spider = new Spider();
        spider.setSpeciesName("  ");

        assertThrows(InvalidSpiderDataException.class, () -> service.addSpider(spider));
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateSpider_updatesWhenExists() {
        UUID id = UUID.randomUUID();

        Spider spider = new Spider();
        spider.setId(id);
        spider.setSpeciesName("Brachypelma hamorii");

        when(spiderRepository.existsById(id)).thenReturn(true);
        when(spiderRepository.save(spider)).thenReturn(spider);

        Spider result = service.updateSpider(spider);

        assertEquals(spider, result);
        verify(spiderRepository).save(spider);
    }

    @Test
    void updateSpider_throwsWhenSpiderNull() {
        assertThrows(InvalidSpiderDataException.class, () -> service.updateSpider(null));
    }

    @Test
    void updateSpider_throwsWhenIdNull() {
        Spider spider = new Spider();
        assertThrows(InvalidSpiderDataException.class, () -> service.updateSpider(spider));
    }

    @Test
    void updateSpider_throwsWhenSpiderNotFound() {
        UUID id = UUID.randomUUID();

        Spider spider = new Spider();
        spider.setId(id);

        when(spiderRepository.existsById(id)).thenReturn(false);

        assertThrows(SpiderNotFoundException.class, () -> service.updateSpider(spider));
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteSpider_deletesWhenExists() {
        UUID id = UUID.randomUUID();

        when(spiderRepository.existsById(id)).thenReturn(true);

        service.deleteSpider(id);

        verify(spiderRepository).deleteById(id);
    }

    @Test
    void deleteSpider_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();

        when(spiderRepository.existsById(id)).thenReturn(false);

        assertThrows(SpiderNotFoundException.class, () -> service.deleteSpider(id));
    }

    // ============================================================
    // FINDERS
    // ============================================================

    @Test
    void getSpiderById_returnsSpider() {
        UUID id = UUID.randomUUID();
        Spider spider = new Spider();
        spider.setId(id);

        when(spiderRepository.findById(id)).thenReturn(Optional.of(spider));

        Spider result = service.getSpiderById(id);

        assertEquals(id, result.getId());
    }

    @Test
    void getSpiderById_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();

        when(spiderRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(SpiderNotFoundException.class, () -> service.getSpiderById(id));
    }

    @Test
    void getSpiderBySpeciesName_returnsList() {
        List<Spider> list = List.of(new Spider());

        when(spiderRepository.findBySpeciesName("versicolor")).thenReturn(list);

        List<Spider> result = service.getSpiderBySpeciesName("versicolor");

        assertEquals(1, result.size());
    }

    @Test
    void getSpiderBySpeciesName_throwsWhenEmpty() {
        when(spiderRepository.findBySpeciesName("versicolor")).thenReturn(Collections.emptyList());

        assertThrows(SpiderNotFoundException.class, () -> service.getSpiderBySpeciesName("versicolor"));
    }

    // ============================================================
    // FULL LIST
    // ============================================================

    @Test
    void getAllSpidersNoPagination_returnsList() {
        List<Spider> list = List.of(new Spider(), new Spider());

        when(spiderRepository.findAllByOrderBySpeciesNameAsc()).thenReturn(list);

        List<Spider> result = service.getAllSpidersNoPagination();

        assertEquals(2, result.size());
    }
}
