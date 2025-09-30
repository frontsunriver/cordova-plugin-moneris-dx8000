// Example: src/app/pages/payment/payment.page.ts
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { MonerisService } from '../../services/moneris.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  
  amount: string = '';
  deviceStatus: any = null;
  
  // Your DX8000 device configuration
  private readonly DX8000_CONFIG = {
    device_ip: '192.168.1.100',  // Change to your DX8000 IP
    port: 8080,                   // Change if different
    connection_type: 'network'
  };

  constructor(
    private monerisService: MonerisService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    // Initialize on page load
    await this.initializeDevice();
  }

  /**
   * Initialize and connect to DX8000 device
   */
  async initializeDevice() {
    const loading = await this.loadingCtrl.create({
      message: 'Connecting to payment device...'
    });
    await loading.present();

    try {
      // Initialize
      await this.monerisService.initialize(this.DX8000_CONFIG);
      
      // Connect
      await this.monerisService.connect();
      
      // Get status
      this.deviceStatus = await this.monerisService.getDeviceStatus();
      
      await loading.dismiss();
      
      this.showAlert('Success', 'Payment device ready');
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', `Failed to connect: ${error}`);
    }
  }

  /**
   * Process a payment
   */
  async processPayment() {
    // Validate amount
    if (!this.amount || parseFloat(this.amount) <= 0) {
      this.showAlert('Error', 'Please enter a valid amount');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Processing payment...\nPlease follow prompts on device'
    });
    await loading.present();

    try {
      const result = await this.monerisService.processPayment({
        amount: this.amount,
        currency: 'CAD'
      });

      await loading.dismiss();

      // Payment successful
      this.showAlert(
        'Payment Successful',
        `Transaction ID: ${result.transaction_id}\nAmount: $${result.amount}`
      );

      // Clear amount
      this.amount = '';

      // Save to your backend/database here
      // await this.saveTransaction(result);

    } catch (error) {
      await loading.dismiss();
      this.showAlert('Payment Failed', error);
    }
  }

  /**
   * Check device status
   */
  async checkStatus() {
    try {
      this.deviceStatus = await this.monerisService.getDeviceStatus();
      
      this.showAlert(
        'Device Status',
        `Connected: ${this.deviceStatus.connected}\nDevice: ${this.deviceStatus.device_name}`
      );
    } catch (error) {
      this.showAlert('Error', error);
    }
  }

  /**
   * Show alert helper
   */
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Disconnect when leaving page
   */
  ionViewWillLeave() {
    this.monerisService.disconnect();
  }
}
