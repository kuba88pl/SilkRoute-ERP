package com.silkroute_erp.sales.service;

import com.silkroute_erp.sales.dto.CustomerDTO;
import com.silkroute_erp.sales.entity.Customer;
import com.silkroute_erp.sales.exception.CustomerAlreadyExistsException;
import com.silkroute_erp.sales.exception.CustomerNotFoundException;
import com.silkroute_erp.sales.exception.InvalidCustomerDataException;
import com.silkroute_erp.sales.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@AutoConfigureMockMvc(addFilters = false)

class CustomerServiceTest {

    private CustomerRepository customerRepository;
    private CustomerService service;

    @BeforeEach
    void setup() {
        customerRepository = mock(CustomerRepository.class);
        service = new CustomerService(customerRepository);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void addCustomer_createsCustomer() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john@example.com");

        when(customerRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(customerRepository.save(customer)).thenReturn(customer);

        Customer result = service.addCustomer(customer);

        assertNotNull(result);
        verify(customerRepository).save(customer);
    }

    @Test
    void addCustomer_throwsWhenCustomerIsNull() {
        assertThrows(InvalidCustomerDataException.class, () -> service.addCustomer(null));
    }

    @Test
    void addCustomer_throwsWhenFirstNameMissing() {
        Customer customer = new Customer();
        customer.setLastName("Doe");

        assertThrows(InvalidCustomerDataException.class, () -> service.addCustomer(customer));
    }

    @Test
    void addCustomer_throwsWhenLastNameMissing() {
        Customer customer = new Customer();
        customer.setFirstName("John");

        assertThrows(InvalidCustomerDataException.class, () -> service.addCustomer(customer));
    }

    @Test
    void addCustomer_throwsWhenEmailExists() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john@example.com");

        when(customerRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(CustomerAlreadyExistsException.class, () -> service.addCustomer(customer));
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateCustomer_updatesFields() {
        UUID id = UUID.randomUUID();

        Customer existing = new Customer();
        existing.setId(id);
        existing.setFirstName("Old");
        existing.setLastName("Name");

        CustomerDTO dto = new CustomerDTO();
        dto.setFirstName("New");
        dto.setEmail("new@example.com");

        when(customerRepository.findById(id)).thenReturn(Optional.of(existing));
        when(customerRepository.save(existing)).thenReturn(existing);

        Customer result = service.updateCustomer(id, dto);

        assertEquals("New", result.getFirstName());
        assertEquals("new@example.com", result.getEmail());
        verify(customerRepository).save(existing);
    }

    @Test
    void updateCustomer_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();
        CustomerDTO dto = new CustomerDTO();

        when(customerRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> service.updateCustomer(id, dto));
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteCustomer_deletesWhenExists() {
        UUID id = UUID.randomUUID();

        when(customerRepository.existsById(id)).thenReturn(true);

        service.deleteCustomer(id);

        verify(customerRepository).deleteById(id);
    }

    @Test
    void deleteCustomer_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();

        when(customerRepository.existsById(id)).thenReturn(false);

        assertThrows(CustomerNotFoundException.class, () -> service.deleteCustomer(id));
    }

    // ============================================================
    // GET ALL
    // ============================================================

    @Test
    void getAllCustomersNoPagination_returnsList() {
        List<Customer> list = List.of(new Customer(), new Customer());

        when(customerRepository.findAllByOrderByLastNameAsc()).thenReturn(list);

        List<Customer> result = service.getAllCustomersNoPagination();

        assertEquals(2, result.size());
    }

    // ============================================================
    // FINDERS
    // ============================================================

    @Test
    void getCustomerById_returnsCustomer() {
        UUID id = UUID.randomUUID();
        Customer customer = new Customer();
        customer.setId(id);

        when(customerRepository.findById(id)).thenReturn(Optional.of(customer));

        Customer result = service.getCustomerById(id);

        assertEquals(id, result.getId());
    }

    @Test
    void getCustomerById_throwsWhenNotFound() {
        UUID id = UUID.randomUUID();

        when(customerRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> service.getCustomerById(id));
    }

    @Test
    void getCustomerByLastName_returnsList() {
        List<Customer> list = List.of(new Customer());

        when(customerRepository.getCustomerByLastName("Doe")).thenReturn(list);

        List<Customer> result = service.getCustomerByLastName("Doe");

        assertEquals(1, result.size());
    }

    @Test
    void getCustomerByLastName_throwsWhenEmpty() {
        when(customerRepository.getCustomerByLastName("Doe")).thenReturn(Collections.emptyList());

        assertThrows(CustomerNotFoundException.class, () -> service.getCustomerByLastName("Doe"));
    }
}
