package com.silkroute_erp.sales.controller;

import com.silkroute_erp.sales.dto.CustomerDTO;
import com.silkroute_erp.sales.dto.CustomerMapper;
import com.silkroute_erp.sales.entity.Customer;
import com.silkroute_erp.sales.exception.CustomerAlreadyExistsException;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.InvalidCustomerDataException;
import com.silkroute_erp.sales.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> addCustomer(@RequestBody CustomerDTO dto) {
        try {
            Customer saved = customerService.addCustomer(CustomerMapper.toEntity(dto));
            return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(saved));
        } catch (InvalidCustomerDataException e) {
            return ResponseEntity.badRequest().build();
        } catch (CustomerAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable UUID id, @RequestBody CustomerDTO dto) {
        try {
            Customer updated = customerService.updateCustomer(id, dto);
            return ResponseEntity.ok(CustomerMapper.toDTO(updated));
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InvalidCustomerDataException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> dtos = customerService.getAllCustomersNoPagination()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(CustomerMapper.toDTO(customerService.getCustomerById(id)));
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
