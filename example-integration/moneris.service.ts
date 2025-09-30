// src/app/services/moneris.service.ts
import { Injectable } from '@angular/core';

declare var MonerisDX8000: any;

export interface MonerisConfig {
  device_ip: string;           // DX8000 IP address
  port: number;                // Port number (8080 or 10009)
  connection_type: string;     // 'network', 'bluetooth', or 'usb'
}

export interface PaymentRequest {
  amount: string;
  order_id?: string;
  currency?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonerisService {
  
  private isInitialized = false;
  private isConnected = false;

  constructor() {}

  /**
   * Initialize Moneris with device connection details
   */
  initialize(config: MonerisConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof MonerisDX8000 === 'undefined') {
        reject('MonerisDX8000 plugin not available');
        return;
      }

      MonerisDX8000.initialize(
        config,
        (result) => {
          this.isInitialized = true;
          resolve(result);
        },
        (error) => {
          this.isInitialized = false;
          reject(error);
        }
      );
    });
  }

  /**
   * Connect to DX8000 device
   */
  connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject('Please initialize first');
        return;
      }

      MonerisDX8000.connect(
        (result) => {
          this.isConnected = true;
          resolve(result);
        },
        (error) => {
          this.isConnected = false;
          reject(error);
        }
      );
    });
  }

  /**
   * Disconnect from device
   */
  disconnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      MonerisDX8000.disconnect(
        (result) => {
          this.isConnected = false;
          resolve(result);
        },
        reject
      );
    });
  }

  /**
   * Process payment
   */
  processPayment(paymentRequest: PaymentRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Device not connected');
        return;
      }

      MonerisDX8000.processPayment(
        paymentRequest,
        resolve,
        reject
      );
    });
  }

  /**
   * Process refund
   */
  processRefund(amount: string, transactionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Device not connected');
        return;
      }

      const refundData = {
        amount: amount,
        transaction_id: transactionId
      };

      MonerisDX8000.processRefund(
        refundData,
        resolve,
        reject
      );
    });
  }

  /**
   * Get device status
   */
  getDeviceStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      MonerisDX8000.getDeviceStatus(resolve, reject);
    });
  }

  /**
   * Check if initialized
   */
  isDeviceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Check if connected
   */
  isDeviceConnected(): boolean {
    return this.isConnected;
  }
}
