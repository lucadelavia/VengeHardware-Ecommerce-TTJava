package com.vengehardware.vengehardware.order.service;

import com.vengehardware.vengehardware.order.model.Order;
import com.vengehardware.vengehardware.order.repository.OrderRepository;
import com.vengehardware.vengehardware.product.model.Product;
import com.vengehardware.vengehardware.product.repository.ProductRepository;
import com.vengehardware.vengehardware.exception.InsufficientStockException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Order createOrder(Order order) {
        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (order.getQuantity() > product.getStock()) {
            throw new InsufficientStockException("Not enough stock for product: " + product.getName());
        }

        double unitPrice = product.getPrice();
        double total = unitPrice * order.getQuantity();

        product.setStock(product.getStock() - order.getQuantity());
        productRepository.save(product);

        order.setUnitPrice(unitPrice);
        order.setTotal(total);

        return orderRepository.save(order);
    }
}
