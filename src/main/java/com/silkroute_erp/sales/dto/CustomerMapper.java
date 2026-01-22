package com.silkroute_erp.sales.dto;

import com.silkroute_erp.sales.entity.Customer;

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
}
