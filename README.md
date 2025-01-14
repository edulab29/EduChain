Hedera Testnet Deployments: https://hashscan.io/testnet/token/0.0.5384720

# EduChain
EduChain transforms how academic and professional credentials are issued and verified by leveraging the Hedera Token Service (HTS). Educational institutions can issue tokenized diplomas, certificates, and transcripts directly to students' wallets, ensuring secure, tamper-proof ownership of their academic achievements.

EduChain is a decentralized education credential management system built on the Hedera Hashgraph network. It allows educational institutions to issue, verify, and manage digital credentials as NFTs, providing a secure and immutable record of academic achievements.


## Features

- **Credential Issuance**: Create and issue digital educational credentials as NFTs
- **Credential Verification**: Instantly verify the authenticity of credentials
- **Credential Management**: View and manage all issued and received credentials
- **Token Association**: Automatic handling of token association for recipients
- **Blockchain Security**: Built on Hedera's secure and scalable network
- **Real-time Updates**: Track credential status and transactions in real-time

## Tech Stack

- React
- TypeScript
- Hedera Hashgraph SDK
- Tailwind CSS
- shadcn/ui Components
- WalletConnect

## Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Hedera testnet account
- The Hashpack wallet browser extension

## Installation

1. Clone the repository:
```bash
git clone https://github.com/edulab29/educhain.git
cd educhain
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
HEDERA_OPERATOR_ID=your_operator_account_id
HEDERA_OPERATOR_KEY=your_operator_private_key
```

4. Initialize the token (one-time setup):
```bash
node src/contexts/EduCred.js
```

5. Start the development server:
```bash
npm run dev
```

## Usage

### Issuing Credentials

1. Connect your Hedera wallet using the "Connect Wallet" button
2. Navigate to the "Issue" tab
3. Fill in the credential details:
   - Recipient address
   - Credential type
   - Program name
   - Institution
   - Award date
   - Additional details (optional)
4. Click "Issue Credential"
5. Confirm the transaction in your wallet

### Verifying Credentials

1. Navigate to the "Verify" tab
2. Enter the credential ID
3. View verification results and credential details

### Managing Credentials

1. Navigate to the "Manage" tab
2. View all credentials associated with your account
3. Download or revoke credentials as needed

## Architecture

The system uses Hedera's NFT capabilities to represent educational credentials:
- Each credential is a unique NFT
- Metadata is stored on Hedera File Service
- Token relationships track credential ownership
- Smart contracts ensure secure transfers and revocations

## Development

### Project Structure
```
educhain/
├── src/
│   ├── components/
│   │   ├── ui/         # Reusable UI components
│   │   └── dapp/       # DApp-specific components
│   ├── contexts/       # React contexts
│   ├── services/       # Hedera service layer
│   └── config/         # Configuration files
├── scripts/            # Utility scripts
└── public/            # Static assets
```

### Key Components

1. `HederaService`: Handles all interactions with the Hedera network
2. `WalletContext`: Manages wallet connection and state
3. `IssueCredentials`: Handles credential issuance workflow
4. `VerifyCredentials`: Manages credential verification
5. `ManageCredentials`: Handles credential management and revocation


## Deployment

For production deployment:

1. Build the project:
```bash
npm run build
```

2. Configure for mainnet:
   - Update network settings in `HederaService.ts`
   - Update environment variables
   - Initialize mainnet token

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
- Open an issue on GitHub
- Text @Tom_Tom29 on Telegram

## Acknowledgments

- Hedera Hashgraph team
- Hashpack wallet team
- shadcn/ui components library
- All contributors and testers
