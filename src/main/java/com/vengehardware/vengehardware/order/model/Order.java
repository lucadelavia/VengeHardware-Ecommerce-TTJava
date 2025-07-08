package com.vengehardware.vengehardware.order.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime date = LocalDateTime.now();

    private int productId;
    private int quantity;
    private double unitPrice;
    private double total;
    private String status = "pending";
}
