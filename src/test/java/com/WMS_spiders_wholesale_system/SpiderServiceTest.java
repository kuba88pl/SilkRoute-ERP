//package com.WMS_spiders_wholesale_system;
//
//import com.entity.sales.Spider;
//import com.exception.sales.InvalidSpiderDataException;
//import com.exception.sales.SpiderNotFoundException;
//import com.repository.sales.SpiderRepository;
//import com.service.sales.SpiderService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.domain.*;
//
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class SpiderServiceTest {
//
//    @Mock
//    private SpiderRepository spiderRepository;
//
//    @InjectMocks
//    private SpiderService spiderService;
//
//    @Test
//    void shouldAddValidSpider() {
//        // given
//        Spider spider = new Spider("Brachypelma", "smithi", 2, "L", 150.0, true);
//        when(spiderRepository.save(spider)).thenReturn(spider);
//
//        // when
//        Spider saved = spiderService.addSpider(spider);
//
//        // then
//        assertEquals("smithi", saved.getSpeciesName());
//        verify(spiderRepository).save(spider);
//    }
//
//    @Test
//    void shouldThrowExceptionForInvalidSpider() {
//        // given
//        Spider spider = new Spider();
//        spider.setSpeciesName(""); // invalid
//
//        // then
//        assertThrows(InvalidSpiderDataException.class, () -> spiderService.addSpider(spider));
//    }
//
//    @Test
//    void shouldUpdateSpiderSuccessfully() {
//        // given
//        UUID id = UUID.randomUUID();
//        Spider existing = new Spider("Poecilotheria", "metallica", 1, "M", 300.0, true);
//        existing.setId(id);
//
//        Spider updated = new Spider("Poecilotheria", "metallica", 3, "XL", 350.0, true);
//        updated.setId(id);
//
//        when(spiderRepository.findById(id)).thenReturn(Optional.of(existing));
//        when(spiderRepository.save(any(Spider.class))).thenReturn(updated);
//
//        // when
//        Spider result = spiderService.updateSpider(updated);
//
//        // then
//        assertEquals(3, result.getQuantity());
//        assertEquals("XL", result.getSize());
//        verify(spiderRepository).save(existing);
//    }
//
//    @Test
//    void shouldThrowExceptionWhenUpdatingNonexistentSpider() {
//        // given
//        UUID id = UUID.randomUUID();
//        Spider spider = new Spider();
//        spider.setId(id);
//
//        when(spiderRepository.findById(id)).thenReturn(Optional.empty());
//
//        // then
//        assertThrows(SpiderNotFoundException.class, () -> spiderService.updateSpider(spider));
//    }
//
//    @Test
//    void shouldReturnSpiderById() {
//        // given
//        UUID id = UUID.randomUUID();
//        Spider spider = new Spider();
//        spider.setId(id);
//        when(spiderRepository.findById(id)).thenReturn(Optional.of(spider));
//
//        // when
//        Spider result = spiderService.getSpiderById(id);
//
//        // then
//        assertEquals(id, result.getId());
//    }
//
//    @Test
//    void shouldThrowExceptionWhenSpiderNotFoundById() {
//        // given
//        UUID id = UUID.randomUUID();
//        when(spiderRepository.findById(id)).thenReturn(Optional.empty());
//
//        // then
//        assertThrows(SpiderNotFoundException.class, () -> spiderService.getSpiderById(id));
//    }
//
//    @Test
//    void shouldDeleteSpiderSuccessfully() {
//        // given
//        UUID id = UUID.randomUUID();
//        when(spiderRepository.existsById(id)).thenReturn(true);
//
//        // when
//        spiderService.removeSpider(id);
//
//        // then
//        verify(spiderRepository).deleteById(id);
//    }
//
//    @Test
//    void shouldThrowExceptionWhenDeletingNonexistentSpider() {
//        // given
//        UUID id = UUID.randomUUID();
//        when(spiderRepository.existsById(id)).thenReturn(false);
//
//        // then
//        assertThrows(SpiderNotFoundException.class, () -> spiderService.removeSpider(id));
//    }
//
//    @Test
//    void shouldReturnPagedSpiders() {
//        // given
//        Pageable pageable = PageRequest.of(0, 10, Sort.by("speciesName"));
//        Page<Spider> page = new PageImpl<>(List.of(new Spider()));
//        when(spiderRepository.findAll(pageable)).thenReturn(page);
//
//        // when
//        Page<Spider> result = spiderService.getAllSpiders(0, 10, Sort.by("speciesName"));
//
//        // then
//        assertEquals(1, result.getContent().size());
//    }
//
//    @Test
//    void shouldValidateCorrectSpider() throws Exception {
//        // given
//        Spider spider = new Spider("Brachypelma", "smithi", 1, "L", 150.0, true);
//
//        // then
//        assertDoesNotThrow(() -> {
//            var method = SpiderService.class.getDeclaredMethod("validateSpider", Spider.class);
//            method.setAccessible(true);
//            method.invoke(spiderService, spider);
//        });
//    }
//
//    @Test
//    void shouldThrowExceptionForInvalidSpiderData() throws Exception {
//        // given
//        Spider spider = new Spider();
//        spider.setQuantity(-1); // invalid
//
//        // then
//        assertThrows(InvalidSpiderDataException.class, () -> {
//            var method = SpiderService.class.getDeclaredMethod("validateSpider", Spider.class);
//            method.setAccessible(true);
//            method.invoke(spiderService, spider);
//        });
//    }
//}
