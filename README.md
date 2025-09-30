# Cordova Plugin for Moneris DX8000

A Cordova plugin for integrating Moneris DX8000 payment terminal with Ionic/Cordova Android applications.

## Installation

### Install the plugin

```bash
# Install from local directory
cordova plugin add /path/to/cordova-plugin-moneris-dx8000

# Or for Ionic
ionic cordova plugin add /path/to/cordova-plugin-moneris-dx8000
```

### Add Android platform

```bash
ionic cordova platform add android
```

## Prerequisites

1. **Moneris DX8000 SDK**: You need to obtain the Moneris DX8000 Android SDK from Moneris
2. **DX8000 Device**: Physical Moneris DX8000 payment terminal
3. **Device Connection**: Network (IP/Port), Bluetooth, or USB connection to the device
4. **Android Development**: Android Studio and Android SDK installed

**Note**: This plugin uses **semi-integration** - your app communicates directly with the DX8000 device, which handles all payment processing and communication with Moneris servers. You don't need Store ID or API Token in your app.

## Setup

### 1. Add Moneris SDK

Once you obtain the Moneris SDK:

1. Create a `libs` folder in `src/android/` directory
2. Copy the Moneris SDK `.jar` or `.aar` files into the `libs` folder
3. Update `src/android/build.gradle` to reference the SDK files

### 2. Configure the Plugin

Update the `src/android/build.gradle` file:

```gradle
dependencies {
    implementation files('libs/moneris-sdk.jar')
    // Or if it's an AAR:
    // implementation files('libs/moneris-sdk.aar')
}
```

## Usage

### Initialize the Plugin

```typescript
// In your Ionic/Angular component
declare var MonerisDX8000: any;

// Initialize with device connection details (for semi-integration)
const config = {
  device_ip: '192.168.1.100',    // IP address of DX8000 device
  port: 8080,                     // Port number (typically 8080 or 10009)
  connection_type: 'network'      // 'network', 'bluetooth', or 'usb'
};

// For Bluetooth connection:
// const config = {
//   connection_type: 'bluetooth',
//   bluetooth_address: '00:11:22:33:44:55'
// };

MonerisDX8000.initialize(
  config,
  (result) => {
    console.log('Initialized:', result);
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

### Connect to Device

```typescript
MonerisDX8000.connect(
  (result) => {
    console.log('Connected:', result);
  },
  (error) => {
    console.error('Connection error:', error);
  }
);
```

### Process a Payment

```typescript
const paymentData = {
  amount: '10.00',           // Amount in dollars
  order_id: 'ORDER123',      // Optional: auto-generated if not provided
  currency: 'CAD',           // Optional: defaults to CAD
  transaction_type: 'purchase' // Optional: defaults to purchase
};

MonerisDX8000.processPayment(
  paymentData,
  (response) => {
    console.log('Payment successful:', response);
    // response contains: transaction_id, auth_code, response_code, etc.
  },
  (error) => {
    console.error('Payment failed:', error);
  }
);
```

### Process a Refund

```typescript
const refundData = {
  amount: '10.00',
  transaction_id: '123456789'
};

MonerisDX8000.processRefund(
  refundData,
  (result) => {
    console.log('Refund successful:', result);
  },
  (error) => {
    console.error('Refund failed:', error);
  }
);
```

### Void a Transaction

```typescript
const voidData = {
  transaction_id: '123456789'
};

MonerisDX8000.voidTransaction(
  voidData,
  (result) => {
    console.log('Transaction voided:', result);
  },
  (error) => {
    console.error('Void failed:', error);
  }
);
```

### Check Device Status

```typescript
MonerisDX8000.getDeviceStatus(
  (status) => {
    console.log('Device status:', status);
    // status contains: initialized, connected, device_name
  },
  (error) => {
    console.error('Error getting status:', error);
  }
);
```

### Disconnect from Device

```typescript
MonerisDX8000.disconnect(
  (result) => {
    console.log('Disconnected:', result);
  },
  (error) => {
    console.error('Disconnect error:', error);
  }
);
```

### Cancel Transaction

```typescript
MonerisDX8000.cancelTransaction(
  (result) => {
    console.log('Transaction cancelled:', result);
  },
  (error) => {
    console.error('Cancel failed:', error);
  }
);
```

### Print Receipt

```typescript
const receiptData = {
  transaction_id: '123456789',
  merchant_copy: true
};

MonerisDX8000.printReceipt(
  receiptData,
  (result) => {
    console.log('Receipt printed:', result);
  },
  (error) => {
    console.error('Print failed:', error);
  }
);
```

## Complete Example (Ionic/Angular)

```typescript
import { Component } from '@angular/core';

declare var MonerisDX8000: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
})
export class PaymentPage {
  
  async initializeMoneris() {
    return new Promise((resolve, reject) => {
      const config = {
        store_id: 'YOUR_STORE_ID',
        api_token: 'YOUR_API_TOKEN'
      };
      
      MonerisDX8000.initialize(config, resolve, reject);
    });
  }

  async connectDevice() {
    return new Promise((resolve, reject) => {
      MonerisDX8000.connect(resolve, reject);
    });
  }

  async processPayment(amount: string) {
    try {
      await this.initializeMoneris();
      await this.connectDevice();
      
      const result = await new Promise((resolve, reject) => {
        const paymentData = {
          amount: amount,
          currency: 'CAD'
        };
        
        MonerisDX8000.processPayment(paymentData, resolve, reject);
      });
      
      console.log('Payment successful:', result);
      return result;
      
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
}
```

## API Reference

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `initialize(config, success, error)` | config: {store_id, api_token} | Initialize the plugin with credentials |
| `connect(success, error)` | - | Connect to DX8000 device |
| `disconnect(success, error)` | - | Disconnect from device |
| `processPayment(paymentData, success, error)` | paymentData: {amount, order_id, currency} | Process a payment |
| `processRefund(refundData, success, error)` | refundData: {amount, transaction_id} | Process a refund |
| `voidTransaction(voidData, success, error)` | voidData: {transaction_id} | Void a transaction |
| `getDeviceStatus(success, error)` | - | Get device status |
| `cancelTransaction(success, error)` | - | Cancel current transaction |
| `getLastTransaction(success, error)` | - | Get last transaction details |
| `printReceipt(receiptData, success, error)` | receiptData: {transaction_id} | Print receipt |

## Permissions

The plugin requests the following Android permissions:

- `BLUETOOTH` - For Bluetooth communication
- `BLUETOOTH_ADMIN` - For Bluetooth administration
- `BLUETOOTH_CONNECT` - For Bluetooth connection (Android 12+)
- `BLUETOOTH_SCAN` - For Bluetooth scanning (Android 12+)
- `ACCESS_FINE_LOCATION` - Required for Bluetooth on Android
- `ACCESS_COARSE_LOCATION` - Required for Bluetooth on Android
- `INTERNET` - For API communication

## Important Notes

1. **Moneris SDK Required**: This plugin provides the structure but requires the actual Moneris SDK to function
2. **TODO Comments**: The Java files contain TODO comments where you need to integrate the actual Moneris SDK calls
3. **Testing**: Test thoroughly with the actual DX8000 device
4. **Security**: Never hardcode credentials in your app - use secure storage
5. **Compliance**: Ensure PCI-DSS compliance when handling payment data

## Building

```bash
# Build the Android app
ionic cordova build android

# Run on device
ionic cordova run android --device
```

## Troubleshooting

### Plugin not found
Make sure the plugin is properly installed:
```bash
cordova plugin list
```

### Device not connecting
- Check Bluetooth permissions are granted
- Ensure the DX8000 is powered on and in pairing mode
- Check Android Bluetooth settings

### Build errors
- Verify Android SDK is properly installed
- Check that Moneris SDK files are in the correct location
- Ensure all dependencies in build.gradle are correct

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Your repo URL]
- Moneris Documentation: Contact Moneris support for SDK documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
