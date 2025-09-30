# Quick Start Guide - Moneris DX8000 Plugin

## What You Need

1. ✅ **Moneris DX8000 Device** - Physical payment terminal
2. ✅ **Device Connection** - Network (IP/Port), Bluetooth, or USB
3. ✅ **Moneris DX8000 SDK** for Android (obtain from Moneris)
4. ✅ **Node.js & npm** installed
5. ✅ **Android Studio** installed
6. ✅ **Ionic CLI** installed (`npm install -g @ionic/cli`)
7. ✅ **Cordova CLI** installed (`npm install -g cordova`)

**Note**: This is **semi-integration** - you connect directly to the DX8000 device, not to Moneris servers. No Store ID or API Token needed in your app!

## 5-Minute Setup

### 1. Install the Plugin

```bash
# Navigate to your Ionic project
cd your-ionic-app

# Add the plugin
ionic cordova plugin add /path/to/cordova-plugin-moneris-dx8000
```

### 2. Copy the Service

Create `src/app/services/moneris.service.ts` and copy the service code from `USAGE_EXAMPLE.md`

### 3. Use in Your Component

```typescript
import { MonerisService } from '../services/moneris.service';

constructor(private monerisService: MonerisService) {}

async makePayment() {
  try {
    // Initialize with device connection
    await this.monerisService.initialize({
      device_ip: '192.168.1.100',  // Your DX8000 IP address
      port: 8080,                   // Device port
      connection_type: 'network'
    });
    
    // Connect to device
    await this.monerisService.connect();
    
    // Process payment (device handles everything)
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

### 4. Build and Run

```bash
ionic cordova build android
ionic cordova run android --device
```

## Important Next Steps

### Before Production Use

1. **Get Moneris SDK**
   - Contact Moneris support to obtain the DX8000 Android SDK
   - You'll receive `.jar` or `.aar` files

2. **Add SDK to Plugin**
   ```bash
   # Create libs directory
   mkdir -p /path/to/plugin/src/android/libs
   
   # Copy SDK files
   cp moneris-sdk.jar /path/to/plugin/src/android/libs/
   ```

3. **Implement SDK Calls**
   - Open `src/android/MonerisDX8000.java`
   - Replace `// TODO` comments with actual Moneris SDK calls
   - Follow Moneris SDK documentation for specific API calls

4. **Test Thoroughly**
   - Use test credentials first
   - Test all transaction types
   - Test error scenarios
   - Verify receipt printing

## Current Plugin Status

⚠️ **IMPORTANT:** This plugin provides the **structure and interface** but requires:

1. **Moneris DX8000 SDK** - You must obtain this from Moneris
2. **SDK Integration** - Replace TODO comments in Java files with actual SDK calls
3. **Testing** - Test with real DX8000 device

The plugin currently has placeholder implementations that simulate responses.

## What's Included

### Core Files
- ✅ `plugin.xml` - Plugin configuration
- ✅ `www/MonerisDX8000.js` - JavaScript interface
- ✅ `src/android/MonerisDX8000.java` - Main Android implementation
- ✅ `src/android/PaymentRequest.java` - Payment request model
- ✅ `src/android/PaymentResponse.java` - Payment response model
- ✅ `src/android/build.gradle` - Android build configuration
- ✅ `package.json` - NPM package configuration

### Documentation
- ✅ `README.md` - Complete API reference
- ✅ `USAGE_EXAMPLE.md` - Code examples and usage patterns
- ✅ `INTEGRATION_GUIDE.md` - Step-by-step integration instructions
- ✅ `QUICK_START.md` - This quick start guide
- ✅ `CHANGELOG.md` - Version history

### Configuration
- ✅ `.gitignore` - Git ignore rules
- ✅ `LICENSE` - MIT License

## Plugin API Overview

### Initialize & Connect
```typescript
MonerisDX8000.initialize(config, success, error)
MonerisDX8000.connect(success, error)
MonerisDX8000.disconnect(success, error)
```

### Transactions
```typescript
MonerisDX8000.processPayment(paymentData, success, error)
MonerisDX8000.processRefund(refundData, success, error)
MonerisDX8000.voidTransaction(voidData, success, error)
MonerisDX8000.cancelTransaction(success, error)
```

### Device & Status
```typescript
MonerisDX8000.getDeviceStatus(success, error)
MonerisDX8000.getLastTransaction(success, error)
MonerisDX8000.printReceipt(receiptData, success, error)
```

## Example Transaction Flow

```
1. Initialize Plugin → 2. Connect Device → 3. Process Payment → 4. Print Receipt
```

```typescript
// Complete flow
async completePayment(amount: string) {
  // 1. Initialize
  await this.monerisService.initialize({
    store_id: 'YOUR_STORE_ID',
    api_token: 'YOUR_API_TOKEN'
  });
  
  // 2. Connect
  await this.monerisService.connect();
  
  // 3. Process Payment
  const result = await this.monerisService.processPayment({
    amount: amount,
    currency: 'CAD'
  });
  
  // 4. Print Receipt
  await this.monerisService.printReceipt(result.transaction_id);
  
  return result;
}
```

## Troubleshooting Quick Fixes

### Plugin not found
```bash
cordova plugin remove cordova-plugin-moneris-dx8000
cordova plugin add /path/to/plugin
```

### Build errors
```bash
ionic cordova platform remove android
ionic cordova platform add android
ionic cordova build android
```

### Device won't connect
- Check Bluetooth is enabled
- Grant location permissions (required for Bluetooth)
- Ensure DX8000 is powered on
- Verify device is in pairing mode

## Getting Help

1. **Check Documentation:**
   - `README.md` for API reference
   - `INTEGRATION_GUIDE.md` for detailed setup
   - `USAGE_EXAMPLE.md` for code examples

2. **Moneris Resources:**
   - Contact Moneris support for SDK and documentation
   - Request test credentials for development

3. **Common Issues:**
   - See INTEGRATION_GUIDE.md "Troubleshooting" section

## Test Credentials

Contact Moneris to obtain:
- Test Store ID
- Test API Token
- Test DX8000 device access

## Ready to Build?

```bash
# Development build
ionic cordova build android

# Production build
ionic cordova build android --prod --release

# Run on device
ionic cordova run android --device
```

## Next Steps

1. ✅ Plugin structure created
2. ⏭️ Obtain Moneris DX8000 SDK
3. ⏭️ Add SDK to plugin
4. ⏭️ Implement SDK calls in Java files
5. ⏭️ Test with real device
6. ⏭️ Deploy to production

---

**Need more details?** Check out:
- `INTEGRATION_GUIDE.md` for complete setup instructions
- `USAGE_EXAMPLE.md` for full code examples
- `README.md` for API documentation
