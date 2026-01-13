package com.silkroute_erp.sales.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationHelper {
    public static Pageable createPageable(int page, int size, Sort sort, String defaultSortFiled) {
        if (page < 0) {
            page = 0;
        }
        if(size <= 0) {
            size = 10;
        }
        if (sort == null || sort.isUnsorted()) {
            sort = Sort.by(Sort.Direction.ASC, defaultSortFiled);
        }
        return PageRequest.of(page, size, sort);
    }
}
