# Moneris DX8000 Plugin Integration Guide

## Step-by-Step Integration

### Step 1: Install Prerequisites

```bash
# Install Node.js and npm (if not already installed)
# Download from https://nodejs.org/

# Install Ionic CLI
npm install -g @ionic/cli

# Install Cordova
npm install -g cordova

# Install Android Studio
# Download from https://developer.android.com/studio
```

### Step 2: Create or Use Existing Ionic Project

**Option A: Create a new Ionic project**
```bash
ionic start myPaymentApp blank --type=angular
cd myPaymentApp
```

**Option B: Use existing project**
```bash
cd your-existing-ionic-project
```

### Step 3: Add Android Platform

```bash
ionic cordova platform add android
```

### Step 4: Install the Moneris DX8000 Plugin

```bash
# Install from local path
ionic cordova plugin add /path/to/cordova-plugin-moneris-dx8000

# Or if you want to link for development
cordova plugin add /path/to/cordova-plugin-moneris-dx8000 --link
```

Verify installation:
```bash
cordova plugin list
```

You should see: `cordova-plugin-moneris-dx8000`

### Step 5: Obtain Moneris SDK

1. Contact Moneris to obtain the DX8000 Android SDK
2. You'll receive documentation and SDK files (usually `.jar` or `.aar` files)
3. Request the following:
   - Android SDK for DX8000
   - API documentation
   - Test credentials (Store ID and API Token)
   - Integration guide

### Step 6: Add Moneris SDK to Plugin

1. Create a `libs` directory in the plugin:
```bash
mkdir -p /path/to/cordova-plugin-moneris-dx8000/src/android/libs
```

2. Copy the Moneris SDK files:
```bash
cp moneris-sdk.jar /path/to/cordova-plugin-moneris-dx8000/src/android/libs/
```

3. Update `src/android/build.gradle`:
```gradle
dependencies {
    implementation files('libs/moneris-sdk.jar')
    // Or for AAR files:
    // implementation(name: 'moneris-sdk', ext: 'aar')
}
```

### Step 7: Implement Actual SDK Integration

Open the Java files in `src/android/` and replace the TODO comments with actual Moneris SDK calls.

**Example for `initialize()` method:**
```java
private void initialize(JSONObject config, CallbackContext callbackContext) {
    try {
        this.storeId = config.getString("store_id");
        this.apiToken = config.getString("api_token");
        
        // Replace this with actual Moneris SDK initialization
        MonerisAPI.initialize(
            cordova.getActivity(),
            this.storeId,
            this.apiToken,
            MonerisAPI.Environment.TEST  // or PRODUCTION
        );
        
        this.isInitialized = true;
        
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("message", "Moneris DX8000 initialized successfully");
        
        callbackContext.success(result);
        
    } catch (Exception e) {
        Log.e(TAG, "Initialize error: " + e.getMessage());
        callbackContext.error("Initialization failed: " + e.getMessage());
    }
}
```

### Step 8: Configure Your Ionic App

**Create a service (recommended approach):**

```bash
ionic generate service services/moneris
```

Then copy the service code from `USAGE_EXAMPLE.md` into `src/app/services/moneris.service.ts`

**Create a payment page:**

```bash
ionic generate page pages/payment
```

Then copy the component code from `USAGE_EXAMPLE.md`

### Step 9: Update Android Permissions (if needed)

The plugin already includes necessary permissions in `plugin.xml`, but you may need to request them at runtime for Android 6+:

```typescript
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

constructor(private androidPermissions: AndroidPermissions) {}

async requestPermissions() {
  const permissions = [
    this.androidPermissions.PERMISSION.BLUETOOTH,
    this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
    this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
  ];
  
  await this.androidPermissions.requestPermissions(permissions);
}
```

### Step 10: Build and Test

**Build the app:**
```bash
ionic cordova build android
```

**Run on device:**
```bash
ionic cordova run android --device
```

**Generate APK:**
```bash
ionic cordova build android --release --prod
```

### Step 11: Testing Checklist

1. **Test Environment Setup:**
   - Use Moneris test credentials first
   - Test with DX8000 in test mode
   - Verify device connection

2. **Test Cases:**
   ```
   ✓ Plugin initialization
   ✓ Device connection
   ✓ Payment processing ($1.00, $10.00, $100.00)
   ✓ Declined transactions
   ✓ Refund processing
   ✓ Void transactions
   ✓ Receipt printing
   ✓ Error handling
   ✓ Connection timeout
   ✓ Device disconnect
   ```

3. **Test Scenarios:**
   - Successful payment flow
   - Payment cancellation
   - Network timeout
   - Device not available
   - Invalid credentials
   - App backgrounding during payment
   - Multiple rapid transactions

### Step 12: Production Deployment

**Before going live:**

1. **Switch to Production Credentials:**
```typescript
await this.monerisService.initialize({
  store_id: 'YOUR_PRODUCTION_STORE_ID',
  api_token: 'YOUR_PRODUCTION_API_TOKEN'
});
```

2. **Enable ProGuard (Optional but Recommended):**
Create or update `platforms/android/app/proguard-rules.pro`:
```
-keep class com.moneris.** { *; }
-keep class com.plugin.moneris.** { *; }
```

3. **Sign Your APK:**
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# Build signed APK
ionic cordova build android --release --prod

# Sign the APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name

# Optimize with zipalign
zipalign -v 4 app-release-unsigned.apk myapp-release.apk
```

4. **Test in Production Mode:**
   - Test with real DX8000 device
   - Verify with small amounts first
   - Check receipt printing
   - Verify transaction appears in Moneris portal

## Troubleshooting Common Issues

### Issue 1: Plugin not found
**Solution:**
```bash
# Remove and re-add the plugin
ionic cordova plugin remove cordova-plugin-moneris-dx8000
ionic cordova plugin add /path/to/cordova-plugin-moneris-dx8000

# Clean and rebuild
ionic cordova platform remove android
ionic cordova platform add android
ionic cordova build android
```

### Issue 2: Build errors with SDK
**Solution:**
- Verify SDK files are in the correct location
- Check `build.gradle` has correct dependency syntax
- Ensure Android SDK tools are up to date

### Issue 3: Device won't connect
**Solution:**
- Check Bluetooth is enabled
- Verify permissions are granted
- Ensure DX8000 is powered on
- Try resetting the DX8000 device
- Check device is in pairing mode

### Issue 4: "MonerisDX8000 is not defined"
**Solution:**
- Ensure plugin is installed: `cordova plugin list`
- Wait for `deviceready` event before using plugin
- Check the plugin is properly added to `config.xml`

### Issue 5: Payment timeout
**Solution:**
- Increase timeout values in Moneris SDK configuration
- Implement retry logic
- Check network connectivity
- Verify DX8000 is responsive

## Advanced Configuration

### Custom Timeout Settings

Update the Java plugin to add timeout configuration:

```java
private int connectionTimeout = 30000; // 30 seconds
private int transactionTimeout = 60000; // 60 seconds

private void initialize(JSONObject config, CallbackContext callbackContext) {
    // ... existing code ...
    
    if (config.has("connection_timeout")) {
        this.connectionTimeout = config.getInt("connection_timeout");
    }
    
    if (config.has("transaction_timeout")) {
        this.transactionTimeout = config.getInt("transaction_timeout");
    }
    
    // ... rest of initialization ...
}
```

### Enable Debug Logging

```typescript
// In your app
const config = {
  store_id: 'YOUR_STORE_ID',
  api_token: 'YOUR_API_TOKEN',
  debug: true  // Enable debug logs
};

await this.monerisService.initialize(config);
```

Then update Java code to use debug flag:
```java
if (config.optBoolean("debug", false)) {
    Log.setDebugEnabled(true);
}
```

## Security Best Practices

1. **Never hardcode credentials:**
```typescript
// Bad
const config = { store_id: 'store123', api_token: 'token456' };

// Good - Use environment variables or secure storage
import { environment } from '../environments/environment';
const config = {
  store_id: environment.monerisStoreId,
  api_token: environment.monerisApiToken
};
```

2. **Use HTTPS for all API calls**

3. **Implement certificate pinning** (advanced)

4. **Sanitize user inputs**

5. **Log sensitive data carefully** - Never log full card numbers or PINs

## Support Resources

- **Moneris Developer Portal:** https://developer.moneris.com/
- **Cordova Documentation:** https://cordova.apache.org/docs/
- **Ionic Documentation:** https://ionicframework.com/docs/
- **Plugin Issues:** [Your GitHub Issues Page]

## License

MIT License - See LICENSE file for details
