package com.vengehardware.vengehardware.order.repository;

import com.vengehardware.vengehardware.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
