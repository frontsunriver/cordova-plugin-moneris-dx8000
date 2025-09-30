package com.plugin.moneris;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * PaymentResponse model class
 * Represents a payment transaction response
 */
public class PaymentResponse {
    
    private boolean success;
    private String responseCode;
    private String message;
    private String transactionId;
    private String amount;
    private String authCode;
    private String referenceNumber;
    private long timestamp;

    public PaymentResponse(boolean success, String responseCode, String message, 
                          String transactionId, String amount) {
        this.success = success;
        this.responseCode = responseCode;
        this.message = message;
        this.transactionId = transactionId;
        this.amount = amount;
        this.timestamp = System.currentTimeMillis();
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getResponseCode() {
        return responseCode;
    }

    public String getMessage() {
        return message;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getAmount() {
        return amount;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("success", success);
        json.put("response_code", responseCode);
        json.put("message", message);
        json.put("transaction_id", transactionId);
        json.put("amount", amount);
        json.put("timestamp", timestamp);
        
        if (authCode != null) {
            json.put("auth_code", authCode);
        }
        if (referenceNumber != null) {
            json.put("reference_number", referenceNumber);
        }
        
        return json;
    }
}
