package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {
    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setTelephone(customer.getTelephone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setParcelLocker(customer.getParcelLocker());
        return dto;
    }

    public static Customer toEntity(CustomerDTO dto) {
        Customer entity = new Customer();
        entity.setId(dto.getId());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setTelephone(dto.getTelephone());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());
        entity.setParcelLocker(dto.getParcelLocker());
        return entity;
    }

    public static Page<CustomerDTO> toDTOPage(Page<Customer> customersPage) {
        List<CustomerDTO> dtoList = customersPage.getContent().stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, customersPage.getPageable(), customersPage.getTotalElements());
    }
}