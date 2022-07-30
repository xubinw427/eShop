package com.xubin.ecommerce.dto;

import com.xubin.ecommerce.entity.Address;
import com.xubin.ecommerce.entity.Customer;
import com.xubin.ecommerce.entity.Order;
import com.xubin.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
