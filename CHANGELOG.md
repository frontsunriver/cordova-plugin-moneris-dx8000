# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-30

### Added
- Initial release of Cordova Plugin for Moneris DX8000
- JavaScript interface for all major payment operations
- Android native implementation with CordovaPlugin
- Support for payment processing
- Support for refund transactions
- Support for void transactions
- Device connection management
- Device status checking
- Receipt printing capability
- Transaction cancellation
- Get last transaction details
- Comprehensive documentation and usage examples
- TypeScript service example for Ionic/Angular
- Complete integration guide
- MIT License

### Features
- Initialize plugin with Moneris credentials
- Connect/disconnect to DX8000 device
- Process payments with amount and order details
- Process refunds against previous transactions
- Void transactions
- Check device connection status
- Cancel in-progress transactions
- Print receipts
- Retrieve last transaction information

### Android Permissions
- Bluetooth connectivity
- Location access (required for Bluetooth on Android)
- Internet access for API communication

### Documentation
- README.md with complete API reference
- USAGE_EXAMPLE.md with practical code examples
- INTEGRATION_GUIDE.md with step-by-step setup
- CHANGELOG.md for version tracking

### Known Limitations
- Requires Moneris DX8000 SDK (not included)
- Android platform only (iOS not yet supported)
- Placeholder implementations need to be replaced with actual SDK calls

## [Unreleased]

### Planned Features
- iOS platform support
- Enhanced error handling with specific error codes
- Batch transaction processing
- Transaction history management
- Signature capture
- Tip adjustment functionality
- EMV chip card support
- NFC/Contactless payment support
- Receipt email/SMS functionality
- Multi-currency support
- Offline transaction queue
- Transaction reports
- Settlement operations

### TODO
- Integrate actual Moneris SDK calls
- Add unit tests
- Add integration tests
- Implement proper error code mapping
- Add transaction logging
- Implement retry mechanisms
- Add connection state management
- Improve timeout handling
- Add more detailed device status information
- Implement receipt customization
- Add transaction signature support
