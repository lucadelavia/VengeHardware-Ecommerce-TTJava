package com.vengehardware.vengehardware.product.service;

import com.vengehardware.vengehardware.product.model.Product;
import com.vengehardware.vengehardware.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Optional<Product> getById(int id) {
        return repository.findById(id);
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product update(int id, Product updated) {
        return repository.findById(id).map(p -> {
            p.setName(updated.getName());
            p.setDescription(updated.getDescription());
            p.setPrice(updated.getPrice());
            p.setCategory(updated.getCategory());
            p.setImageUrl(updated.getImageUrl());
            p.setStock(updated.getStock());
            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void delete(int id) {
        repository.deleteById(id);
    }

    public List<Product> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
}
