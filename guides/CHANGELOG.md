# Changelog

All notable changes to NovaAid will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Multi-language support (i18n)
- Mobile app (React Native)
- Full ZK proof verification
- Smart contract external audit
- Hardware wallet support

---

## [1.0.0-beta] - 2025-10-26

### 🎉 Initial Beta Release

This is the first public release of NovaAid, deployed on Celo Alfajores testnet.

### Added

#### Core Infrastructure
- **Semaphore ZK Identity System** - Privacy-preserving identity commitments
- **Merkle Tree Management** - Efficient proof generation and verification
- **Celo Blockchain Integration** - Smart contracts on Alfajores testnet
- **Firebase Backend** - Real-time Firestore database
- **Clerk Authentication** - Role-based access control (user/ngo/admin)
- **Dual Portal System** - Separate interfaces for refugees and NGOs

#### Blockchain Features
- **VerifiedPayments.sol** - Smart contract for verification payments
  - Contract address: `0x8a3a92E1207de2eBA6EF3AB14d2e02b93A6884c5`
  - 0.01 CELO verification fee
  - ReentrancyGuard, Ownable, Pausable security
- **MetaMask Integration** - Wallet connection with auto network switching
- **Transaction Tracking** - Real-time confirmation monitoring
- **Verified Badge System** - On-chain verification status display

#### Communication Features
- **Video Calling** - Secure WebRTC via Daily.co
- **Alert-Based Rooms** - Automatic video room creation for emergencies
- **Audio/Video Controls** - Toggle media streams during calls
- **Short-Lived Tokens** - 1-hour expiry for security

#### AI/ML Services
- **Fraud Detection** - Facial recognition with face-api.js
  - 70% similarity threshold
  - Real-time analysis
  - Admin-only interface
- **Aid Scoring** - Heuristic model for need prioritization
  - Multi-signal scoring (density, food, water, health, weather)
  - Python CLI tool
  - CSV/JSON input support
- **Alert Creation** - AI-powered emergency alert generation
- **Location Tracking** - GPS-based real-time monitoring
  - Multi-user dashboard
  - NGO map view

#### Developer Experience
- **Comprehensive Documentation** - 15+ markdown guides
- **Quick Start Guide** - 15-minute setup instructions
- **Batch Scripts** - One-click service launcher (Windows)
- **API Reference** - Complete endpoint documentation
- **Testing Suite** - Backend, frontend, and contract tests

#### Documentation
- README.md - Comprehensive project overview
- QUICK_START.md - Fast setup guide
- INSTALLATION_COMMANDS.md - Copy-paste commands
- DEPLOYMENT_GUIDE.md - Production deployment
- SEMAPHORE_CELO_IMPLEMENTATION.md - Technical deep-dive
- VIDEO_CALLING_IMPLEMENTATION.md - Video feature docs
- FRAUD_DETECTION_SETUP.md - AI fraud setup
- ALERT_CREATION_SETUP.md - Alert generation guide
- LOCATION_TRACKER_SETUP.md - GPS tracking setup
- CONTRIBUTING.md - Contribution guidelines
- SECURITY.md - Security policy
- LICENSE - MIT License
- CHANGELOG.md - This file

### Security
- Client-side Semaphore identity generation
- Commitment-only storage (no PII)
- JWT authentication with role validation
- Resource ownership verification
- OpenZeppelin security libraries
- Emergency pause mechanism
- Comprehensive .gitignore for secrets

### Infrastructure
- Backend API (Express.js) - Port 3001
- Refugee Portal (Next.js) - Port 3000
- NGO Portal (Next.js) - Port 3002
- Fraud Detection (Vite + React) - Standalone
- Location Tracker - Port 8000
- GitHub Actions CI/CD pipeline

---

## Version History

### Version Naming Convention
- **Major.Minor.Patch-tag**
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes
- Tags: `alpha`, `beta`, `rc` (release candidate), stable (no tag)

### Upcoming Versions

#### [1.1.0] - Planned Q4 2025
- Full ZK proof verification
- Enhanced mobile responsiveness
- Multi-language support (i18n)
- Complete alert management CRUD
- NGO analytics dashboard

#### [1.2.0] - Planned Q1 2026
- External smart contract audit
- Two-factor authentication
- Hardware wallet support
- End-to-end encrypted messaging
- Advanced security features

#### [1.3.0] - Planned Q2 2026
- Redis caching layer
- GraphQL API
- Database sharding
- Performance optimizations
- Load balancing

#### [1.4.0] - Planned Q3 2026
- WalletConnect integration
- Multi-chain support
- IPFS document storage
- DAO governance
- NFT reputation system

#### [1.5.0] - Planned Q4 2026
- React Native mobile apps (iOS/Android)
- Push notifications
- Offline mode
- QR code identity sharing

#### [2.0.0] - Planned 2027
- Celo Mainnet deployment
- Production infrastructure
- Legal compliance
- Marketing campaign
- NGO partnerships

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

---

## Security

See [SECURITY.md](./SECURITY.md) for our security policy and how to report vulnerabilities.

---

**Legend:**
- 🎉 Major milestone
- ✨ New feature
- 🐛 Bug fix
- 🔒 Security improvement
- 📚 Documentation update
- ⚡ Performance improvement
- 🔧 Configuration change
- 🚨 Breaking change
- ⚠️ Deprecation warning
