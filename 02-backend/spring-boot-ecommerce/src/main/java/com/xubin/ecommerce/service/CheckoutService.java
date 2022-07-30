package com.xubin.ecommerce.service;

import com.xubin.ecommerce.dto.Purchase;
import com.xubin.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
