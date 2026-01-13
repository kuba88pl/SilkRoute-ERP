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
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/customers")
public class CustomerController {
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> addCustomer(@RequestBody CustomerDTO customerDTO) {
        logger.info("Received customer DTO: {}", customerDTO);
        try {
            Customer newCustomer = customerService.addCustomer(CustomerMapper.toEntity(customerDTO));
            return ResponseEntity.status(HttpStatus.CREATED).body(CustomerMapper.toDTO(newCustomer));
        } catch (InvalidCustomerDataException e) {
            logger.error("Invalid customer data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (CustomerAlreadyExistsException e) {
            logger.error("Customer already exists: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred while adding customer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable UUID id, @RequestBody CustomerDTO customerDTO) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customerDTO);
            return ResponseEntity.ok(CustomerMapper.toDTO(updatedCustomer));
        } catch (CustomerNotFoundException e) {
            logger.error("Customer not found with id {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (InvalidCustomerDataException e) {
            logger.error("Invalid customer data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (CustomerAlreadyExistsException e) {
            logger.error("Customer already exists: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            logger.error("An unexpected error occurred while updating customer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        var customersPage = customerService.getAllCustomers(page, size, org.springframework.data.domain.Sort.by(sortBy));
        return ResponseEntity.ok(CustomerMapper.toDTOPage(customersPage));
    }

    @GetMapping("/lastName/{lastName}")
    public ResponseEntity<List<CustomerDTO>> getCustomerByLastName(@PathVariable String lastName) {
        try {
            List<Customer> customers = customerService.getCustomerByLastName(lastName);
            List<CustomerDTO> customerDTOs = customers.stream()
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(customerDTOs);
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable UUID id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(CustomerMapper.toDTO(customer));
        } catch (CustomerNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}