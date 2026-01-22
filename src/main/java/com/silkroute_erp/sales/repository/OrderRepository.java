package com.silkroute_erp.sales.repository;

import com.silkroute_erp.sales.entity.Order;
import com.silkroute_erp.sales.entity.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Override
    @EntityGraph(attributePaths = {"customer", "orderedSpiders"})
    Optional<Order> findById(UUID id);

    List<Order> findByStatus(OrderStatus orderStatus);

    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :newStatus WHERE o.id = :orderId")
    void updateOrderStatus(@Param("orderId") UUID orderId, @Param("newStatus") OrderStatus newStatus);

    // NEW — full list without pagination, with eager graph
    @Override
    @EntityGraph(attributePaths = {"customer", "orderedSpiders"})
    List<Order> findAll();
}
