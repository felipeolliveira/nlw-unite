package com.felipeolliveira.passin.dtos.general;

import java.util.List;

public record PaginationDTO<T>(
        String resource,
        List<T> data,
        long totalItems,
        int totalPages,
        int currentPage
) {
}
