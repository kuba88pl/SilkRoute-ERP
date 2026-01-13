package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.CustomerDTO;
import com.silkroute_erp.sales.entity.Customer;
import com.silkroute_erp.sales.exception.CustomerAlreadyExistsException;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.InvalidCustomerDataException;
import com.silkroute_erp.sales.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer addCustomer(Customer customer) {
        validateCustomerForCreate(customer);
        if (customer.getEmail() != null && !customer.getEmail().isBlank() && customerRepository.existsByEmail(customer.getEmail())) {
            throw new CustomerAlreadyExistsException("Customer with email " + customer.getEmail() + " already exists.");
        }
        logger.info("Created new customer with ID: " + customer.getId());
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(UUID id, CustomerDTO customerDTO) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));

        if (customerDTO.getFirstName() != null) {
            customer.setFirstName(customerDTO.getFirstName());
        }
        if (customerDTO.getLastName() != null) {
            customer.setLastName(customerDTO.getLastName());
        }
        if (customerDTO.getTelephone() != null) {
            customer.setTelephone(customerDTO.getTelephone());
        }
        if (customerDTO.getEmail() != null) {
            customer.setEmail(customerDTO.getEmail());
        }
        if (customerDTO.getAddress() != null) {
            customer.setAddress(customerDTO.getAddress());
        }
        if (customerDTO.getParcelLocker() != null) {
            customer.setParcelLocker(customerDTO.getParcelLocker());
        }

        return customerRepository.save(customer);
    }

    public void deleteCustomer(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
        logger.info("Deleted customer with ID: " + id);
        customerRepository.deleteById(id);
    }

    public Page<Customer> getAllCustomers(int page, int size, Sort sort) {
        Pageable pageable = PaginationHelper.createPageable(page, size, sort, "id");
        return customerRepository.findAll(pageable);
    }

    public Customer getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with id " + id + " not found"));
    }

    public List<Customer> getCustomerByLastName(String lastName) throws CustomerNotFoundException {
        List<Customer> customers = customerRepository.getCustomerByLastName(lastName);
        if (customers.isEmpty()) {
            throw new CustomerNotFoundException("Customer with last name " + lastName + " not found");
        }
        return customers;
    }

    private void validateCustomerForCreate(Customer customer) {
        if (customer == null) {
            throw new InvalidCustomerDataException("Customer cannot be null");
        }
        if (customer.getFirstName() == null || customer.getFirstName().isBlank()) {
            throw new InvalidCustomerDataException("First name is required");
        }
        if (customer.getLastName() == null || customer.getLastName().isBlank()) {
            throw new InvalidCustomerDataException("Last name is required");
        }
    }

    private void validateCustomerForUpdate(Customer customer) {
        if (customer == null) {
            throw new InvalidCustomerDataException("Customer cannot be null");
        }
        if (customer.getFirstName() == null || customer.getFirstName().isBlank()) {
            throw new InvalidCustomerDataException("First name is required");
        }
        if (customer.getLastName() == null || customer.getLastName().isBlank()) {
            throw new InvalidCustomerDataException("Last name is required");
        }
    }
}