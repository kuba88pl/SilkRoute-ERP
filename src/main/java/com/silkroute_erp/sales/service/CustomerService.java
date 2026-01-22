package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.CustomerDTO;
import com.silkroute_erp.sales.entity.Customer;
import com.silkroute_erp.sales.exception.CustomerAlreadyExistsException;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.InvalidCustomerDataException;
import com.silkroute_erp.sales.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /* ============================================================
       CREATE
    ============================================================ */
    public Customer addCustomer(Customer customer) {
        validateCustomerForCreate(customer);

        if (customer.getEmail() != null &&
                !customer.getEmail().isBlank() &&
                customerRepository.existsByEmail(customer.getEmail())) {
            throw new CustomerAlreadyExistsException(
                    "Customer with email " + customer.getEmail() + " already exists."
            );
        }

        return customerRepository.save(customer);
    }

    /* ============================================================
       UPDATE
    ============================================================ */
    public Customer updateCustomer(UUID id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new CustomerNotFoundException("Customer with id " + id + " not found")
                );

        if (dto.getFirstName() != null) customer.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) customer.setLastName(dto.getLastName());
        if (dto.getTelephone() != null) customer.setTelephone(dto.getTelephone());
        if (dto.getEmail() != null) customer.setEmail(dto.getEmail());
        if (dto.getAddress() != null) customer.setAddress(dto.getAddress());
        if (dto.getParcelLocker() != null) customer.setParcelLocker(dto.getParcelLocker());

        return customerRepository.save(customer);
    }

    /* ============================================================
       DELETE
    ============================================================ */
    public void deleteCustomer(UUID id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer with id " + id + " not found");
        }
        customerRepository.deleteById(id);
    }

    /* ============================================================
       FULL LIST
    ============================================================ */
    public List<Customer> getAllCustomersNoPagination() {
        return customerRepository.findAllByOrderByLastNameAsc();
    }

    /* ============================================================
       FINDERS
    ============================================================ */
    public Customer getCustomerById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new CustomerNotFoundException("Customer with id " + id + " not found")
                );
    }

    public List<Customer> getCustomerByLastName(String lastName) {
        List<Customer> customers = customerRepository.getCustomerByLastName(lastName);
        if (customers.isEmpty()) {
            throw new CustomerNotFoundException("Customer with last name " + lastName + " not found");
        }
        return customers;
    }

    /* ============================================================
       VALIDATION
    ============================================================ */
    private void validateCustomerForCreate(Customer customer) {
        if (customer == null) throw new InvalidCustomerDataException("Customer cannot be null");
        if (customer.getFirstName() == null || customer.getFirstName().isBlank())
            throw new InvalidCustomerDataException("First name is required");
        if (customer.getLastName() == null || customer.getLastName().isBlank())
            throw new InvalidCustomerDataException("Last name is required");
    }
}
