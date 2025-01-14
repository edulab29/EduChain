// scripts/initToken.js
import {
    Client,
    AccountId,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    Hbar,
    TokenInfoQuery
} from "@hashgraph/sdk";
import fs from "fs";
import path from "path";
  
  // Operator credentials
  const HEDERA_OPERATOR_ID = '0.0.5295087';
  const HEDERA_OPERATOR_KEY = '302e020100300506032b65700422042041439d4aa5730d597def89d8a1b4e43eeeed54e7833b5de0f2085565ce2e1da3';
  
  async function initializeToken() {
    try {
      // Check if we already have a token ID saved
      // const tokenConfigPath = path.join(__dirname, '../src/config/token.json');
      // if (fs.existsSync(tokenConfigPath)) {
      //   console.log('Token configuration already exists.');
      //   const config = JSON.parse(fs.readFileSync(tokenConfigPath, 'utf8'));
      //   console.log('Existing Token ID:', config.tokenId);
      //   return;
      // }
  
      // Create and configure a Hedera client
      const client = Client.forTestnet();
      
      // Set the operator account ID and private key
      client.setOperator(
        AccountId.fromString(HEDERA_OPERATOR_ID),
        PrivateKey.fromString(HEDERA_OPERATOR_KEY)
      );
  
      console.log('Creating new token...');
  
      // Create the token
      const transaction = new TokenCreateTransaction()
        .setTokenName("EDUCHAIN")
        .setTokenSymbol("EDCRED")
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setInitialSupply(0)
        .setMaxSupply(1000000)
        .setTreasuryAccountId(AccountId.fromString(HEDERA_OPERATOR_ID))
        .setAdminKey(PrivateKey.fromString(HEDERA_OPERATOR_KEY))
        .setSupplyKey(PrivateKey.fromString(HEDERA_OPERATOR_KEY))
        .setFreezeDefault(false)
        .setMaxTransactionFee(new Hbar(30));
  
      // Submit the transaction
      const signedTx = await transaction.freezeWith(client).sign(PrivateKey.fromString(HEDERA_OPERATOR_KEY));
      const response = await signedTx.execute(client);
      const receipt = await response.getReceipt(client);
      const tokenId = receipt.tokenId;
  
      console.log('Token created successfully!');
      console.log('Token ID:', tokenId.toString());
  
      // Verify the token was created successfully
      const tokenInfo = await new TokenInfoQuery()
        .setTokenId(tokenId)
        .execute(client);
  
      console.log('Token Info:', {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        totalSupply: tokenInfo.totalSupply.toString(),
        maxSupply: tokenInfo.maxSupply ? tokenInfo.maxSupply.toString() : '0'
      });
  
      // // Create config directory if it doesn't exist
      // const configDir = path.dirname(tokenConfigPath);
      // if (!fs.existsSync(configDir)) {
      //   fs.mkdirSync(configDir, { recursive: true });
      // }
  
      // // Save token information to config file
      // const tokenConfig = {
      //   tokenId: tokenId.toString(),
      //   name: tokenInfo.name,
      //   symbol: tokenInfo.symbol,
      //   created: new Date().toISOString()
      // };
  
      // fs.writeFileSync(tokenConfigPath, JSON.stringify(tokenConfig, null, 2));
      // console.log('Token configuration saved to:', tokenConfigPath);
  
      // Clean up
      client.close();
  
    } catch (error) {
      console.error('Error initializing token:', error);
      process.exit(1);
    }
  }
  
  // Run the initialization
  initializeToken().catch(console.error);