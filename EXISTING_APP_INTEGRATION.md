# Adding Moneris Plugin to Your Existing Ionic Cordova App

## Complete Step-by-Step Guide

### Step 1: Install the Plugin

```bash
# Navigate to your existing Ionic app
cd your-ionic-app

# Add the plugin from local path
ionic cordova plugin add D:\cordova\moneris

# Verify installation
cordova plugin list
# Should show: cordova-plugin-moneris-dx8000 1.0.0 "MonerisDX8000"
```

### Step 2: Ensure Android Platform is Added

```bash
# If not already added
ionic cordova platform add android

# Or update existing platform
ionic cordova platform update android
```

### Step 3: Create Moneris Service

```bash
# Generate the service
ionic generate service services/moneris
```

This creates:
- `src/app/services/moneris.service.ts`
- `src/app/services/moneris.service.spec.ts`

### Step 4: Copy Service Code

Copy the content from `example-integration/moneris.service.ts` into your `src/app/services/moneris.service.ts`

Or manually add this code:

```typescript
// src/app/services/moneris.service.ts
import { Injectable } from '@angular/core';

declare var MonerisDX8000: any;

export interface MonerisConfig {
  device_ip: string;
  port: number;
  connection_type: string;
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

  initialize(config: MonerisConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof MonerisDX8000 === 'undefined') {
        reject('MonerisDX8000 plugin not available');
        return;
      }

      MonerisDX8000.initialize(config, 
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

  processPayment(paymentRequest: PaymentRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Device not connected');
        return;
      }

      MonerisDX8000.processPayment(paymentRequest, resolve, reject);
    });
  }

  processRefund(amount: string, transactionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Device not connected');
        return;
      }

      MonerisDX8000.processRefund(
        { amount, transaction_id: transactionId },
        resolve,
        reject
      );
    });
  }

  getDeviceStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      MonerisDX8000.getDeviceStatus(resolve, reject);
    });
  }

  isDeviceInitialized(): boolean {
    return this.isInitialized;
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }
}
```

### Step 5: Use in Any Component/Page

#### Option A: Use in Existing Page

Open any existing page component and inject the service:

```typescript
// In your existing component
import { MonerisService } from '../services/moneris.service';

constructor(
  private monerisService: MonerisService,
  // ... your other services
) {}

async processPayment() {
  try {
    // Initialize
    await this.monerisService.initialize({
      device_ip: '192.168.1.100',
      port: 8080,
      connection_type: 'network'
    });
    
    // Connect
    await this.monerisService.connect();
    
    // Process payment
    const result = await this.monerisService.processPayment({
      amount: '10.00',
      currency: 'CAD'
    });
    
    console.log('Payment successful!', result);
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

#### Option B: Create New Payment Page

```bash
# Generate a new page
ionic generate page pages/payment
```

Then copy the code from:
- `example-integration/payment.page.ts` → `src/app/pages/payment/payment.page.ts`
- `example-integration/payment.page.html` → `src/app/pages/payment/payment.page.html`

### Step 6: Configure Your DX8000 Device IP

**Find your DX8000 IP address:**
1. On the DX8000, press **Menu**
2. Go to **Settings** → **Network** → **IP Configuration**
3. Note the IP address (e.g., `192.168.1.100`)

**Update in your code:**
```typescript
const DX8000_CONFIG = {
  device_ip: '192.168.1.100',  // ← Change this to your actual IP
  port: 8080,                   // ← Usually 8080 or 10009
  connection_type: 'network'
};
```

### Step 7: Add Module Imports (if needed)

If you're using `[(ngModel)]` in your HTML, ensure `FormsModule` is imported:

```typescript
// In your page module (e.g., payment.module.ts)
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  // ← Add this
    IonicModule,
    PaymentPageRoutingModule
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
```

### Step 8: Build and Test

```bash
# Build for Android
ionic cordova build android

# Run on connected device
ionic cordova run android --device

# Or run in emulator
ionic cordova run android
```

### Step 9: Test on Real Device

**Important:** The plugin needs to be tested on a **real Android device** with access to your DX8000 device on the same network.

1. Connect your Android device via USB
2. Enable USB debugging on the device
3. Run: `ionic cordova run android --device`
4. Ensure your Android device is on the same WiFi network as the DX8000

## Quick Test Code

Add this to any page to quickly test:

```typescript
import { Component } from '@angular/core';
import { MonerisService } from '../services/moneris.service';

@Component({
  selector: 'app-test',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Test Moneris</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button (click)="testPayment()" expand="block">
        Test Payment $1.00
      </ion-button>
    </ion-content>
  `
})
export class TestPage {
  
  constructor(private moneris: MonerisService) {}

  async testPayment() {
    try {
      console.log('Initializing...');
      await this.moneris.initialize({
        device_ip: '192.168.1.100',  // ← Your DX8000 IP
        port: 8080,
        connection_type: 'network'
      });
      
      console.log('Connecting...');
      await this.moneris.connect();
      
      console.log('Processing payment...');
      const result = await this.moneris.processPayment({
        amount: '1.00',
        currency: 'CAD'
      });
      
      console.log('SUCCESS:', result);
      alert('Payment successful! TX ID: ' + result.transaction_id);
    } catch (error) {
      console.error('ERROR:', error);
      alert('Error: ' + error);
    }
  }
}
```

## Example: Adding to Home Page

If you want to add payment functionality to your existing home page:

```typescript
// src/app/home/home.page.ts
import { Component } from '@angular/core';
import { MonerisService } from '../services/moneris.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  amount: string = '';

  constructor(
    private moneris: MonerisService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ionViewDidEnter() {
    // Initialize device when page loads
    await this.initDevice();
  }

  async initDevice() {
    try {
      await this.moneris.initialize({
        device_ip: '192.168.1.100',  // Your DX8000 IP
        port: 8080,
        connection_type: 'network'
      });
      
      await this.moneris.connect();
      console.log('Device ready');
    } catch (error) {
      console.error('Device init failed:', error);
    }
  }

  async processPayment() {
    const loading = await this.loadingCtrl.create({
      message: 'Processing payment...'
    });
    await loading.present();

    try {
      const result = await this.moneris.processPayment({
        amount: this.amount,
        currency: 'CAD'
      });

      await loading.dismiss();
      
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: `Payment approved! Transaction ID: ${result.transaction_id}`,
        buttons: ['OK']
      });
      await alert.present();

      this.amount = ''; // Clear
    } catch (error) {
      await loading.dismiss();
      
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
```

```html
<!-- src/app/home/home.page.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>My App</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  
  <ion-card>
    <ion-card-header>
      <ion-card-title>Payment</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label position="floating">Amount</ion-label>
        <ion-input type="number" [(ngModel)]="amount"></ion-input>
      </ion-item>
      
      <ion-button expand="block" (click)="processPayment()">
        Pay Now
      </ion-button>
    </ion-card-content>
  </ion-card>

</ion-content>
```

## Troubleshooting

### "MonerisDX8000 is not defined"

**Cause:** Plugin not installed or not loaded properly.

**Fix:**
```bash
# Remove and re-add plugin
ionic cordova plugin remove cordova-plugin-moneris-dx8000
ionic cordova plugin add D:\cordova\moneris

# Rebuild
ionic cordova build android
```

### "Plugin not available"

**Cause:** Running in browser or emulator.

**Fix:** Run on real Android device:
```bash
ionic cordova run android --device
```

### Cannot connect to device

**Checklist:**
- ✅ DX8000 is powered on
- ✅ DX8000 is on same network
- ✅ IP address is correct
- ✅ Port number is correct
- ✅ Android device is on same network

### Build errors

```bash
# Clean and rebuild
ionic cordova platform remove android
ionic cordova platform add android
ionic cordova build android
```

## Important Notes

1. **Real Device Required** - Must test on real Android device, not browser/emulator
2. **Network Access** - Device and DX8000 must be on same network
3. **Permissions** - App will request Bluetooth and Location permissions
4. **Device IP** - Update the IP address to match your DX8000
5. **Moneris SDK** - You'll need to add the actual Moneris SDK files (contact Moneris)

## Next Steps

1. ✅ Plugin installed
2. ✅ Service created
3. ✅ Code added to component
4. ⏭️ Update DX8000 IP address in code
5. ⏭️ Build and test on real device
6. ⏭️ Obtain Moneris SDK from Moneris
7. ⏭️ Add SDK to plugin and integrate

## Files Created

The example integration files are in `D:\cordova\moneris\example-integration\`:
- `moneris.service.ts` - Service code
- `payment.page.ts` - Example page component
- `payment.page.html` - Example page template

Copy these into your app as needed!

## Need Help?

Check these files in the plugin directory:
- `README.md` - API reference
- `SEMI_INTEGRATION_GUIDE.md` - Semi-integration explanation
- `QUICK_START.md` - Quick start guide
- `USAGE_EXAMPLE.md` - More code examples
