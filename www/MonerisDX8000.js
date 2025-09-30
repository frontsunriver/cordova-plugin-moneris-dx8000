var exec = require('cordova/exec');

/**
 * MonerisDX8000 Plugin
 * JavaScript interface for Moneris DX8000 payment terminal
 */
var MonerisDX8000 = {
    
    /**
     * Initialize the Moneris DX8000 connection
     * @param {Object} config - Configuration object with device_ip, port, connection_type, etc.
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    initialize: function(config, success, error) {
        exec(success, error, 'MonerisDX8000', 'initialize', [config]);
    },

    /**
     * Process a payment transaction
     * @param {Object} paymentData - Payment data including amount, transaction type, etc.
     * @param {Function} success - Success callback with transaction result
     * @param {Function} error - Error callback
     */
    processPayment: function(paymentData, success, error) {
        exec(success, error, 'MonerisDX8000', 'processPayment', [paymentData]);
    },

    /**
     * Process a refund transaction
     * @param {Object} refundData - Refund data including amount, original transaction ID, etc.
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    processRefund: function(refundData, success, error) {
        exec(success, error, 'MonerisDX8000', 'processRefund', [refundData]);
    },

    /**
     * Void a transaction
     * @param {Object} voidData - Void data including transaction ID
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    voidTransaction: function(voidData, success, error) {
        exec(success, error, 'MonerisDX8000', 'voidTransaction', [voidData]);
    },

    /**
     * Check device status
     * @param {Function} success - Success callback with device status
     * @param {Function} error - Error callback
     */
    getDeviceStatus: function(success, error) {
        exec(success, error, 'MonerisDX8000', 'getDeviceStatus', []);
    },

    /**
     * Connect to the DX8000 device
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    connect: function(success, error) {
        exec(success, error, 'MonerisDX8000', 'connect', []);
    },

    /**
     * Disconnect from the DX8000 device
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    disconnect: function(success, error) {
        exec(success, error, 'MonerisDX8000', 'disconnect', []);
    },

    /**
     * Cancel the current transaction
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    cancelTransaction: function(success, error) {
        exec(success, error, 'MonerisDX8000', 'cancelTransaction', []);
    },

    /**
     * Get the last transaction result
     * @param {Function} success - Success callback with transaction data
     * @param {Function} error - Error callback
     */
    getLastTransaction: function(success, error) {
        exec(success, error, 'MonerisDX8000', 'getLastTransaction', []);
    },

    /**
     * Print receipt
     * @param {Object} receiptData - Receipt data
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    printReceipt: function(receiptData, success, error) {
        exec(success, error, 'MonerisDX8000', 'printReceipt', [receiptData]);
    }
};

module.exports = MonerisDX8000;
