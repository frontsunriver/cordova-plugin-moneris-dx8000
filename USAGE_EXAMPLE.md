# Usage Examples for Moneris DX8000 Plugin

## Complete Ionic/Angular Service Example

Create a service to manage Moneris operations:

```typescript
// moneris.service.ts
import { Injectable } from '@angular/core';

declare var MonerisDX8000: any;

export interface MonerisConfig {
  device_ip?: string;              // For network connection
  port?: number;                   // For network connection (default 8080)
  connection_type?: string;        // 'network', 'bluetooth', 'usb'
  bluetooth_address?: string;      // For Bluetooth connection
}

export interface PaymentRequest {
  amount: string;
  order_id?: string;
  currency?: string;
  transaction_type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonerisService {
  
  private isInitialized = false;
  private isConnected = false;

  constructor() {}

  /**
   * Initialize Moneris with credentials
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
   * Connect to device
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
   * Void transaction
   */
  voidTransaction(transactionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Device not connected');
        return;
      }

      const voidData = {
        transaction_id: transactionId
      };

      MonerisDX8000.voidTransaction(
        voidData,
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
   * Cancel current transaction
   */
  cancelTransaction(): Promise<any> {
    return new Promise((resolve, reject) => {
      MonerisDX8000.cancelTransaction(resolve, reject);
    });
  }

  /**
   * Print receipt
   */
  printReceipt(transactionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const receiptData = {
        transaction_id: transactionId
      };

      MonerisDX8000.printReceipt(
        receiptData,
        resolve,
        reject
      );
    });
  }

  /**
   * Get last transaction
   */
  getLastTransaction(): Promise<any> {
    return new Promise((resolve, reject) => {
      MonerisDX8000.getLastTransaction(resolve, reject);
    });
  }
}
```

## Component Example

```typescript
// payment.page.ts
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { MonerisService } from '../services/moneris.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  
  amount: string = '';
  deviceStatus: any = null;
  lastTransaction: any = null;

  constructor(
    private monerisService: MonerisService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.initializeMoneris();
  }

  async initializeMoneris() {
    const loading = await this.loadingCtrl.create({
      message: 'Initializing Moneris...'
    });
    await loading.present();

    try {
      // Initialize with device connection details
      await this.monerisService.initialize({
        device_ip: '192.168.1.100',  // Your DX8000 device IP
        port: 8080,                   // Device port
        connection_type: 'network'    // or 'bluetooth'
      });

      // Connect to device
      await this.monerisService.connect();

      // Get status
      this.deviceStatus = await this.monerisService.getDeviceStatus();

      await loading.dismiss();
      
      this.showAlert('Success', 'Moneris initialized and connected');
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', error);
    }
  }

  async processPayment() {
    if (!this.amount || parseFloat(this.amount) <= 0) {
      this.showAlert('Error', 'Please enter a valid amount');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Processing payment...'
    });
    await loading.present();

    try {
      const result = await this.monerisService.processPayment({
        amount: this.amount,
        currency: 'CAD'
      });

      await loading.dismiss();

      this.lastTransaction = result;
      
      this.showAlert(
        'Payment Successful',
        `Transaction ID: ${result.transaction_id}<br>Amount: $${result.amount}`
      );

      // Optionally print receipt
      await this.printReceipt(result.transaction_id);

      // Clear amount
      this.amount = '';
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Payment Failed', error);
    }
  }

  async refundLastTransaction() {
    if (!this.lastTransaction) {
      this.showAlert('Error', 'No transaction to refund');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Refund',
      message: `Refund $${this.lastTransaction.amount}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Refund',
          handler: async () => {
            await this.processRefund(
              this.lastTransaction.amount,
              this.lastTransaction.transaction_id
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async processRefund(amount: string, transactionId: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Processing refund...'
    });
    await loading.present();

    try {
      const result = await this.monerisService.processRefund(amount, transactionId);
      
      await loading.dismiss();
      
      this.showAlert('Refund Successful', `Amount: $${amount}`);
      
      this.lastTransaction = null;
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Refund Failed', error);
    }
  }

  async voidLastTransaction() {
    if (!this.lastTransaction) {
      this.showAlert('Error', 'No transaction to void');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Void',
      message: 'Void this transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Void',
          handler: async () => {
            await this.processVoid(this.lastTransaction.transaction_id);
          }
        }
      ]
    });

    await alert.present();
  }

  async processVoid(transactionId: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Voiding transaction...'
    });
    await loading.present();

    try {
      const result = await this.monerisService.voidTransaction(transactionId);
      
      await loading.dismiss();
      
      this.showAlert('Transaction Voided', 'Transaction has been voided');
      
      this.lastTransaction = null;
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Void Failed', error);
    }
  }

  async printReceipt(transactionId: string) {
    try {
      await this.monerisService.printReceipt(transactionId);
    } catch (error) {
      console.error('Print receipt error:', error);
    }
  }

  async checkDeviceStatus() {
    try {
      this.deviceStatus = await this.monerisService.getDeviceStatus();
      
      this.showAlert(
        'Device Status',
        `Connected: ${this.deviceStatus.connected}<br>` +
        `Device: ${this.deviceStatus.device_name}`
      );
    } catch (error) {
      this.showAlert('Error', error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ionViewWillLeave() {
    // Disconnect when leaving the page
    this.monerisService.disconnect();
  }
}
```

## HTML Template Example

```html
<!-- payment.page.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>Moneris Payment</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div class="payment-container">
    
    <!-- Device Status -->
    <ion-card *ngIf="deviceStatus">
      <ion-card-header>
        <ion-card-title>Device Status</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p><strong>Device:</strong> {{ deviceStatus.device_name }}</p>
        <p><strong>Connected:</strong> 
          <ion-badge [color]="deviceStatus.connected ? 'success' : 'danger'">
            {{ deviceStatus.connected ? 'Yes' : 'No' }}
          </ion-badge>
        </p>
        <ion-button expand="block" (click)="checkDeviceStatus()">
          Refresh Status
        </ion-button>
      </ion-card-content>
    </ion-card>

    <!-- Payment Form -->
    <ion-card>
      <ion-card-header>
        <ion-card-title>Process Payment</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="floating">Amount (CAD)</ion-label>
          <ion-input 
            type="number" 
            [(ngModel)]="amount" 
            placeholder="0.00"
            step="0.01">
          </ion-input>
        </ion-item>
        
        <ion-button 
          expand="block" 
          (click)="processPayment()"
          [disabled]="!amount || !deviceStatus?.connected">
          Process Payment
        </ion-button>
      </ion-card-content>
    </ion-card>

    <!-- Last Transaction -->
    <ion-card *ngIf="lastTransaction">
      <ion-card-header>
        <ion-card-title>Last Transaction</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p><strong>Transaction ID:</strong> {{ lastTransaction.transaction_id }}</p>
        <p><strong>Amount:</strong> ${{ lastTransaction.amount }}</p>
        <p><strong>Status:</strong> {{ lastTransaction.message }}</p>
        
        <ion-button expand="block" color="warning" (click)="refundLastTransaction()">
          Refund Transaction
        </ion-button>
        
        <ion-button expand="block" color="danger" (click)="voidLastTransaction()">
          Void Transaction
        </ion-button>
      </ion-card-content>
    </ion-card>

  </div>
</ion-content>
```

## JavaScript/Vanilla Example (No Framework)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Moneris DX8000 Test</title>
</head>
<body>
  <h1>Moneris DX8000 Payment</h1>
  
  <div id="status"></div>
  
  <h2>Process Payment</h2>
  <input type="number" id="amount" placeholder="Amount" step="0.01">
  <button onclick="processPayment()">Pay</button>
  
  <h2>Actions</h2>
  <button onclick="initialize()">Initialize</button>
  <button onclick="connect()">Connect</button>
  <button onclick="checkStatus()">Check Status</button>
  <button onclick="disconnect()">Disconnect</button>

  <script type="text/javascript" src="cordova.js"></script>
  <script type="text/javascript">
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
      console.log('Device ready');
      updateStatus('Device ready. Please initialize.');
    }

    function updateStatus(message) {
      document.getElementById('status').innerHTML = message;
    }

    function initialize() {
      const config = {
        store_id: 'YOUR_STORE_ID',
        api_token: 'YOUR_API_TOKEN'
      };

      MonerisDX8000.initialize(
        config,
        function(result) {
          updateStatus('Initialized: ' + result.message);
        },
        function(error) {
          updateStatus('Error: ' + error);
        }
      );
    }

    function connect() {
      MonerisDX8000.connect(
        function(result) {
          updateStatus('Connected: ' + result.message);
        },
        function(error) {
          updateStatus('Connection error: ' + error);
        }
      );
    }

    function processPayment() {
      const amount = document.getElementById('amount').value;
      
      if (!amount || parseFloat(amount) <= 0) {
        updateStatus('Please enter a valid amount');
        return;
      }

      const paymentData = {
        amount: amount,
        currency: 'CAD'
      };

      updateStatus('Processing payment...');

      MonerisDX8000.processPayment(
        paymentData,
        function(result) {
          updateStatus('Payment successful! Transaction ID: ' + result.transaction_id);
        },
        function(error) {
          updateStatus('Payment failed: ' + error);
        }
      );
    }

    function checkStatus() {
      MonerisDX8000.getDeviceStatus(
        function(status) {
          updateStatus('Connected: ' + status.connected + ', Device: ' + status.device_name);
        },
        function(error) {
          updateStatus('Status error: ' + error);
        }
      );
    }

    function disconnect() {
      MonerisDX8000.disconnect(
        function(result) {
          updateStatus('Disconnected: ' + result.message);
        },
        function(error) {
          updateStatus('Disconnect error: ' + error);
        }
      );
    }
  </script>
</body>
</html>
```

## Testing Checklist

- [ ] Initialize plugin with valid credentials
- [ ] Connect to DX8000 device
- [ ] Process a payment transaction
- [ ] Print receipt
- [ ] Process a refund
- [ ] Void a transaction
- [ ] Check device status
- [ ] Cancel a transaction in progress
- [ ] Handle errors gracefully
- [ ] Disconnect properly on app close

## Next Steps

1. Obtain the Moneris DX8000 SDK from Moneris
2. Add the SDK files to `src/android/libs/`
3. Update the Java code with actual Moneris SDK calls
4. Test with a real DX8000 device
5. Implement proper error handling
6. Add logging for debugging
7. Handle edge cases and timeouts
