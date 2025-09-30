package com.plugin.moneris;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * PaymentRequest model class
 * Represents a payment transaction request
 */
public class PaymentRequest {
    
    private String amount;
    private String orderId;
    private String currency;
    private String transactionType;
    private JSONObject metadata;

    public PaymentRequest(JSONObject data) throws JSONException {
        this.amount = data.getString("amount");
        this.orderId = data.optString("order_id", generateOrderId());
        this.currency = data.optString("currency", "CAD");
        this.transactionType = data.optString("transaction_type", "purchase");
        this.metadata = data.optJSONObject("metadata");
    }

    private String generateOrderId() {
        return "ORD" + System.currentTimeMillis();
    }

    public String getAmount() {
        return amount;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getCurrency() {
        return currency;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public JSONObject getMetadata() {
        return metadata;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("amount", amount);
        json.put("order_id", orderId);
        json.put("currency", currency);
        json.put("transaction_type", transactionType);
        if (metadata != null) {
            json.put("metadata", metadata);
        }
        return json;
    }
}
