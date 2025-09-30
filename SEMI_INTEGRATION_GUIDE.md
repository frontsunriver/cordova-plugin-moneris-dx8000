# Semi-Integration Guide - Moneris DX8000

## What is Semi-Integration?

**Semi-integration** is a payment integration model where:
- ✅ Your app sends transaction requests **directly to the payment device** (DX8000)
- ✅ The device handles **all sensitive payment data** (card numbers, PINs, etc.)
- ✅ The device communicates with **Moneris servers** for authorization
- ✅ Your app receives the transaction result from the device

## Semi-Integration vs Full Integration

### Semi-Integration (This Plugin) ✅
```
Your App → DX8000 Device → Moneris Servers
         ↖︎_____________↙︎
         (Result back to app)
```

**What you send to device:**
- Payment amount
- Transaction type (purchase, refund, void)
- Order ID (optional)

**What the device handles:**
- Card reading (chip, swipe, contactless)
- PIN entry
- Customer prompts
- EMV processing
- Communication with Moneris
- Receipt printing

**Benefits:**
- ✅ PCI compliant (you never touch card data)
- ✅ Simpler to implement
- ✅ Lower liability
- ✅ Device firmware handles security updates
- ✅ No need for Store ID/API Token in your app

### Full Integration ❌ (Not This Plugin)
```
Your App → Moneris API Servers
```

**What you would handle:**
- Card data processing
- PCI compliance requirements
- Security certificates
- Direct API integration
- Store ID and API Token management

**Not recommended for most use cases!**

## How This Plugin Works

### 1. Connection Setup

You connect to the DX8000 device using one of three methods:

**Network Connection (Most Common)**
```typescript
await MonerisDX8000.initialize({
  device_ip: '192.168.1.100',  // DX8000 IP address on your network
  port: 8080,                   // Communication port
  connection_type: 'network'
});
```

**Bluetooth Connection**
```typescript
await MonerisDX8000.initialize({
  connection_type: 'bluetooth',
  bluetooth_address: '00:11:22:33:44:55'  // DX8000 Bluetooth MAC
});
```

**USB Connection**
```typescript
await MonerisDX8000.initialize({
  connection_type: 'usb'
});
```

### 2. Payment Flow

```typescript
// 1. Initialize (one time)
await MonerisDX8000.initialize({
  device_ip: '192.168.1.100',
  port: 8080,
  connection_type: 'network'
});

// 2. Connect to device
await MonerisDX8000.connect();

// 3. Send payment request (only amount and basic info)
const result = await MonerisDX8000.processPayment({
  amount: '10.00',
  currency: 'CAD',
  order_id: 'ORDER123'  // optional
});

// 4. Device handles everything:
//    - Prompts customer to insert/tap card
//    - Reads card data
//    - Asks for PIN if needed
//    - Sends to Moneris for authorization
//    - Shows result on device screen
//    - Prints receipt

// 5. You get the result
console.log('Transaction ID:', result.transaction_id);
console.log('Status:', result.message);
console.log('Auth Code:', result.auth_code);
```

## Finding Your DX8000 Device IP

### Method 1: DX8000 Menu
1. On the DX8000, press the **Menu** button
2. Navigate to **Settings** → **Network** → **IP Configuration**
3. Note the IP address shown (e.g., `192.168.1.100`)

### Method 2: Router Admin Panel
1. Log into your router's admin panel
2. Look for "Connected Devices" or "DHCP Clients"
3. Find the device named "Moneris" or "DX8000"
4. Note its IP address

### Method 3: Network Scanner
Use a network scanning tool (like Fing or Advanced IP Scanner) to find devices on your network.

## Typical Port Numbers

- **8080** - Common default port
- **10009** - Alternative Moneris port
- **9000** - Another common port

Check your DX8000 documentation or settings for the correct port.

## Connection Types Explained

### Network (TCP/IP) - Recommended ✅
**Use when:**
- DX8000 is on the same network as your device
- You have WiFi or Ethernet connection
- You know the device IP address

**Pros:**
- Reliable connection
- No pairing required
- Works from any device on network
- Faster than Bluetooth

**Setup:**
```typescript
{
  device_ip: '192.168.1.100',
  port: 8080,
  connection_type: 'network'
}
```

### Bluetooth
**Use when:**
- Mobile POS scenarios
- No network available
- Device-to-device pairing preferred

**Pros:**
- Wireless
- Works without network
- Direct device pairing

**Cons:**
- Requires pairing
- Shorter range
- Potentially slower

**Setup:**
```typescript
{
  connection_type: 'bluetooth',
  bluetooth_address: '00:11:22:33:44:55'
}
```

### USB
**Use when:**
- Direct wired connection needed
- Maximum reliability required
- Fixed installation

**Pros:**
- Most reliable
- No network needed
- Fastest connection

**Cons:**
- Requires cable
- Limited mobility

**Setup:**
```typescript
{
  connection_type: 'usb'
}
```

## What You DON'T Need

❌ **Store ID** - Not required (device has it configured)
❌ **API Token** - Not required (device handles authentication)
❌ **Payment Gateway Account** - Device manages this
❌ **PCI Compliance Certification** - Device is certified
❌ **SSL Certificates** - Device handles encryption

## What the DX8000 Needs (Pre-configured)

The DX8000 device should be pre-configured with:
- ✅ Merchant Store ID
- ✅ Moneris credentials
- ✅ Network settings
- ✅ Terminal configuration

**This is done during device setup/provisioning by Moneris or your merchant services provider.**

## Security Considerations

### What's Secure ✅
- Card data never leaves the device
- PIN is encrypted by the device
- Communication between device and Moneris is encrypted
- Your app only sees transaction results
- No sensitive data stored in your app

### What You Should Do
- ✅ Use HTTPS for any communication with your backend
- ✅ Validate transaction results
- ✅ Store transaction IDs securely
- ✅ Implement proper user authentication
- ✅ Log transactions for auditing

### What You Should NOT Do
- ❌ Never try to capture card data in your app
- ❌ Never store full card numbers
- ❌ Never log sensitive customer data
- ❌ Never bypass device prompts

## Transaction Types Supported

### Purchase
```typescript
await MonerisDX8000.processPayment({
  amount: '10.00',
  transaction_type: 'purchase'
});
```

### Refund
```typescript
await MonerisDX8000.processRefund({
  amount: '10.00',
  transaction_id: '123456789'
});
```

### Void
```typescript
await MonerisDX8000.voidTransaction({
  transaction_id: '123456789'
});
```

## Testing

### Test Mode
Most DX8000 devices can be configured for test mode:
1. Contact Moneris support to enable test mode
2. Test transactions won't be charged
3. Use test amounts (e.g., $1.00) for testing

### Test Scenarios
- ✅ Successful payment
- ✅ Declined card
- ✅ Cancelled transaction
- ✅ Connection timeout
- ✅ Device unavailable
- ✅ Refund processing
- ✅ Void transaction

## Troubleshooting

### Can't Connect to Device

**Check:**
1. Device is powered on
2. Device is on the same network
3. IP address is correct
4. Port number is correct
5. No firewall blocking connection
6. Device is not in use by another app

### Transaction Fails

**Check:**
1. Device is connected to Moneris (internet connection)
2. Merchant account is active
3. Transaction amount is valid
4. Device has paper for receipts

### Timeout Errors

**Solutions:**
1. Increase timeout values
2. Check network speed
3. Ensure device is responsive
4. Restart device if needed

## Example: Complete Payment Flow

```typescript
export class PaymentService {
  
  async processCustomerPayment(amount: string) {
    try {
      // 1. Initialize connection
      await MonerisDX8000.initialize({
        device_ip: '192.168.1.100',
        port: 8080,
        connection_type: 'network'
      });
      
      // 2. Connect to device
      await MonerisDX8000.connect();
      
      // 3. Show loading to user
      console.log('Please follow prompts on payment device...');
      
      // 4. Process payment
      // (Device now takes over - customer interacts with DX8000)
      const result = await MonerisDX8000.processPayment({
        amount: amount,
        currency: 'CAD'
      });
      
      // 5. Handle result
      if (result.success && result.response_code === '00') {
        // Payment approved!
        console.log('Payment approved!');
        console.log('Transaction ID:', result.transaction_id);
        
        // 6. Print receipt
        await MonerisDX8000.printReceipt({
          transaction_id: result.transaction_id
        });
        
        // 7. Save to your database
        await this.saveTransaction(result);
        
        return result;
      } else {
        // Payment declined
        console.error('Payment declined:', result.message);
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      // 8. Disconnect (optional)
      await MonerisDX8000.disconnect();
    }
  }
}
```

## Best Practices

### Connection Management
- ✅ Initialize once when app starts
- ✅ Reuse connection for multiple transactions
- ✅ Disconnect when app closes
- ✅ Handle connection errors gracefully

### User Experience
- ✅ Show clear instructions to customer
- ✅ Display amount before processing
- ✅ Show loading state during transaction
- ✅ Provide clear success/failure messages
- ✅ Offer receipt options (print, email, SMS)

### Error Handling
- ✅ Always implement try-catch blocks
- ✅ Provide user-friendly error messages
- ✅ Log errors for debugging
- ✅ Implement retry logic where appropriate
- ✅ Allow transaction cancellation

### Performance
- ✅ Keep connection alive between transactions
- ✅ Implement reasonable timeouts
- ✅ Cache device configuration
- ✅ Handle slow networks gracefully

## Advantages of Semi-Integration

1. **Security** - Card data never enters your app
2. **Compliance** - PCI DSS scope reduced dramatically
3. **Simplicity** - Less code, fewer requirements
4. **Reliability** - Device handles complex payment logic
5. **Updates** - Moneris updates device firmware
6. **Support** - Moneris provides device support

## Limitations

- Requires physical DX8000 device
- Device must be accessible (network/Bluetooth/USB)
- Limited customization of payment flow
- Dependent on device availability
- May have device-specific quirks

## Summary

This plugin provides **semi-integrated** payment processing:
- ✅ You send amount → Device processes → You get result
- ✅ No Store ID or API Token needed in your app
- ✅ Connection via IP/Port (network) or Bluetooth/USB
- ✅ PCI compliant out of the box
- ✅ Simple, secure, reliable

**Perfect for:** Retail POS, restaurants, service businesses, mobile payments

**Not suitable for:** E-commerce, online payments, server-to-server integrations

---

For more information:
- Check `README.md` for API reference
- Check `QUICK_START.md` for setup instructions
- Check `USAGE_EXAMPLE.md` for code examples
