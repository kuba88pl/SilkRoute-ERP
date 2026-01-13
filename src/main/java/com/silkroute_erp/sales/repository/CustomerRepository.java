package com.silkroute_erp.sales.repository;

import com.silkroute_erp.sales.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
List<Customer> getCustomerByLastName(String lastName);

    boolean existsByEmail(String email);
}
