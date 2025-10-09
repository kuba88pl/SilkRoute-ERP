package com.WMS_spiders_wholesale_system;

import com.WMS_spiders_wholesale_system.dto.CustomerDTO;
import com.WMS_spiders_wholesale_system.entity.Customer;
import com.WMS_spiders_wholesale_system.exception.CustomerAlreadyExistsException;
import com.WMS_spiders_wholesale_system.exception.CustomerNotFoundException;
import com.WMS_spiders_wholesale_system.exception.InvalidCustomerDataException;
import com.WMS_spiders_wholesale_system.repository.CustomerRepository;
import com.WMS_spiders_wholesale_system.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private UUID customerId;
    private Customer testCustomer;
    private CustomerDTO customerDTO;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID();

        testCustomer = new Customer();
        testCustomer.setId(customerId);
        testCustomer.setFirstName("Jan");
        testCustomer.setLastName("Kowalski");
        testCustomer.setEmail("jan.kowalski@test.com");

        customerDTO = new CustomerDTO();
        customerDTO.setFirstName("Piotr");
        customerDTO.setEmail("piotr.nowak@test.com");
    }

    @Test
    void addCustomer_Success() {
        // ARRANGE
        when(customerRepository.existsByEmail(testCustomer.getEmail())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);

        // ACT
        Customer result = customerService.addCustomer(testCustomer);

        // ASSERT
        assertNotNull(result);
        assertEquals(testCustomer.getEmail(), result.getEmail());

        verify(customerRepository, times(1)).existsByEmail(testCustomer.getEmail());
        verify(customerRepository, times(1)).save(testCustomer);
    }

    @Test
    void addCustomer_ThrowsCustomerAlreadyExistsException() {
        // ARRANGE

        when(customerRepository.existsByEmail(testCustomer.getEmail())).thenReturn(true);

        // ACT & ASSERT
        assertThrows(CustomerAlreadyExistsException.class, () -> customerService.addCustomer(testCustomer));

        verify(customerRepository, times(0)).save(any(Customer.class));
    }

    @Test
    void addCustomer_ThrowsInvalidCustomerDataException_NullFirstName() {
        // ARRANGE
        testCustomer.setFirstName(null);

        // ACT & ASSERT
        assertThrows(InvalidCustomerDataException.class, () -> customerService.addCustomer(testCustomer));
    }

    @Test
    void updateCustomer_Success() throws CustomerNotFoundException {
        // ARRANGE
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);

        // ACT
        Customer result = customerService.updateCustomer(customerId, customerDTO);

        // ASSERT
        assertNotNull(result);
        assertEquals(customerDTO.getFirstName(), result.getFirstName());
        assertEquals(customerDTO.getEmail(), result.getEmail());
        assertEquals(testCustomer.getLastName(), result.getLastName());

        verify(customerRepository, times(1)).findById(customerId);
        verify(customerRepository, times(1)).save(testCustomer);
    }

    @Test
    void updateCustomer_ThrowsCustomerNotFoundException() {
        // ARRANGE
        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(CustomerNotFoundException.class, () -> customerService.updateCustomer(customerId, customerDTO));

        verify(customerRepository, times(0)).save(any(Customer.class));
    }

    @Test
    void deleteCustomer_Success() {
        // ARRANGE
        when(customerRepository.existsById(customerId)).thenReturn(true);

        doNothing().when(customerRepository).deleteById(customerId);

        // ACT
        customerService.deleteCustomer(customerId);

        // ASSERT
        verify(customerRepository, times(1)).existsById(customerId);
        verify(customerRepository, times(1)).deleteById(customerId);
    }

    @Test
    void deleteCustomer_ThrowsCustomerNotFoundException() {
        // ARRANGE
        when(customerRepository.existsById(customerId)).thenReturn(false);

        // ACT & ASSERT
        assertThrows(CustomerNotFoundException.class, () -> customerService.deleteCustomer(customerId));

        verify(customerRepository, times(0)).deleteById(customerId);
    }


    @Test
    void getCustomerById_Success() {
        // ARRANGE
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));

        // ACT
        Customer result = customerService.getCustomerById(customerId);

        // ASSERT
        assertNotNull(result);
        assertEquals(customerId, result.getId());
        verify(customerRepository, times(1)).findById(customerId);
    }

    @Test
    void getCustomerById_ThrowsCustomerNotFoundException() {
        // ARRANGE
        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(CustomerNotFoundException.class, () -> customerService.getCustomerById(customerId));
    }

    @Test
    void getCustomerByLastName_Success() throws CustomerNotFoundException {
        // ARRANGE
        String lastName = "Nowak";
        Customer customer1 = new Customer();
        customer1.setLastName(lastName);
        List<Customer> foundCustomers = List.of(customer1);

        when(customerRepository.getCustomerByLastName(lastName)).thenReturn(foundCustomers);

        // ACT
        List<Customer> result = customerService.getCustomerByLastName(lastName);

        // ASSERT
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(customerRepository, times(1)).getCustomerByLastName(lastName);
    }

    @Test
    void getCustomerByLastName_ThrowsCustomerNotFoundException() {
        // ARRANGE
        String lastName = "NieIstnieje";
        // Mock zwraca pustą listę
        when(customerRepository.getCustomerByLastName(lastName)).thenReturn(Collections.emptyList());

        // ACT & ASSERT
        CustomerNotFoundException thrown = assertThrows(
                CustomerNotFoundException.class,
                () -> customerService.getCustomerByLastName(lastName)
        );

        assertTrue(thrown.getMessage().contains("Customer with last name " + lastName + " not found"));
        verify(customerRepository, times(1)).getCustomerByLastName(lastName);
    }


    @Test
    void getAllCustomers_ReturnsPage() {
        // ARRANGE
        int page = 0;
        int size = 10;
        Sort sort = Sort.by("lastName").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        List<Customer> customerList = List.of(testCustomer);
        Page<Customer> customerPage = new PageImpl<>(customerList, pageable, 1);

        when(customerRepository.findAll(any(Pageable.class))).thenReturn(customerPage);

        // ACT
        Page<Customer> result = customerService.getAllCustomers(page, size, sort);

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());

        verify(customerRepository, times(1)).findAll(any(Pageable.class));
    }
}