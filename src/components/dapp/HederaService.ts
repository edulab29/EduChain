// services/HederaService.ts
import {
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenBurnTransaction,
    TokenInfoQuery,
    TokenId,
    TransferTransaction,
    FileCreateTransaction,
    FileContentsQuery,
    AccountId,
    PrivateKey,
    Client,
    AccountInfoQuery,
    TokenNftInfoQuery,
    NftId,
    Hbar,
    TokenAssociateTransaction,
    TokenType,
    TokenSupplyType,
    FileId,
    TransactionResponse,
  } from "@hashgraph/sdk";

  const HEDERA_OPERATOR_ID = '0.0.5295087';
  const HEDERA_OPERATOR_KEY = '302e020100300506032b65700422042041439d4aa5730d597def89d8a1b4e43eeeed54e7833b5de0f2085565ce2e1da3';
  const TOKEN_ID = '0.0.5384720'; 

  function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
    const view = new Uint8Array(arrayBuffer);
    let hex = '';
    for (let i = 0; i < view.length; i++) {
      const value = view[i].toString(16);
      hex += value.length === 1 ? '0' + value : value;
    }
    return hex;
  }
  

  function stringToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }
  
  export interface CredentialMetadata {
    title: string;
    type: string;
    institution: string;
    issueDate: string;
    recipient: string;
    issuer: string;
    additionalDetails?: string;
  }
  
  class HederaCredentialService {
    private client: Client;
    private tokenId: TokenId | null = null;
    private adminKey: PrivateKey;
    
    constructor() {
        this.client = Client.forTestnet();
        
        const operatorId = AccountId.fromString(HEDERA_OPERATOR_ID);
        const operatorKey = PrivateKey.fromString(HEDERA_OPERATOR_KEY);
        
        this.client.setOperator(operatorId, operatorKey);
        this.adminKey = operatorKey;
    
        // Initialize tokenId from constant if provided
        if (TOKEN_ID) {
          this.tokenId = TokenId.fromString(TOKEN_ID);
        }
    
        this.client.setMaxAttempts(5);
        this.client.setRequestTimeout(15000);
      }
    
  
    private async executeWithRetry<T>(
      operation: () => Promise<T>,
      maxRetries: number = 3,
      delayMs: number = 1000
    ): Promise<T> {
      let lastError;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          console.warn(`Attempt ${attempt + 1} failed:`, error);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
          }
        }
      }
      
      throw lastError;
    }

    private async ensureTokenAssociation(accountId: AccountId, tokenId: TokenId): Promise<void> {
        try {
          // Get account info
          const accountInfo = await new AccountInfoQuery()
            .setAccountId(accountId)
            .execute(this.client);
    
          // Check if the token exists in the relationships
          const tokenRelationship = accountInfo.tokenRelationships?.get(tokenId.toString());
          const isAssociated = tokenRelationship !== undefined && tokenRelationship !== null;
    
          if (!isAssociated) {
            console.log('Token not associated, creating association...');
            
            // Create token association transaction
            const transaction = await new TokenAssociateTransaction()
              .setAccountId(accountId)
              .setTokenIds([tokenId])
              .setMaxTransactionFee(new Hbar(2))
              .freezeWith(this.client);
    
            // Since this requires the recipient's signature, we need to handle it differently
            throw new Error(`Account ${accountId.toString()} needs to be associated with token ${tokenId.toString()}. Please associate your account first.`);
          }
    
          console.log('Token is already associated with the account');
        } catch (error) {
          console.error('Error in token association:', error);
          throw error;
        }
      }
    
      async isAccountAssociatedWithToken(accountId: string): Promise<boolean> {
        try {
          const account = AccountId.fromString(accountId);
          const accountInfo = await new AccountInfoQuery()
            .setAccountId(account)
            .execute(this.client);
    
          const tokenRelationship = this.tokenId ? accountInfo.tokenRelationships?.get(this.tokenId.toString()) : undefined;
          return tokenRelationship !== undefined && tokenRelationship !== null;
        } catch (error) {
          console.error('Error checking token association:', error);
          return false;
        }
      }
    
      async associateToken(accountId: string): Promise<boolean> {
        try {
          if (await this.isAccountAssociatedWithToken(accountId)) {
            return true;
          }
    
          const transaction = await new TokenAssociateTransaction()
            .setAccountId(AccountId.fromString(accountId))
            .setTokenIds([this.tokenId!])
            .setMaxTransactionFee(new Hbar(30))
            .freezeWith(this.client);
    
          const response = await transaction.execute(this.client);
          const receipt = await response.getReceipt(this.client);
    
          return receipt.status.toString() === 'SUCCESS';
        } catch (error) {
          console.error('Error creating association transaction:', error);
          throw new Error('Failed to create token association transaction');
        }
      }
    
    
  
    async initializeTokenIfNeeded() {
        // Skip initialization if token ID is already set from constant
        if (this.tokenId) {
          return this.tokenId;
        }
    
        try {
          const transaction = await this.executeWithRetry(async () => {
            const tx = new TokenCreateTransaction()
              .setTokenName("EDUCHAIN")
              .setTokenSymbol("EDCRED")
              .setTokenType(TokenType.NonFungibleUnique)
              .setSupplyType(TokenSupplyType.Finite)
              .setInitialSupply(0)
              .setMaxSupply(1000000)
              .setTreasuryAccountId(this.client.operatorAccountId!)
              .setAdminKey(this.adminKey)
              .setSupplyKey(this.adminKey)
              .setFreezeDefault(false)
              .setMaxTransactionFee(new Hbar(30));
    
            return tx.freezeWith(this.client);
          });
    
          const signedTx = await transaction.sign(this.adminKey);
          const response = await signedTx.execute(this.client);
          const receipt = await response.getReceipt(this.client);
          this.tokenId = receipt.tokenId!;
          console.log(`Token created with ID: ${this.tokenId.toString()}`);
          
          return this.tokenId;
        } catch (error) {
          console.error('Error initializing token:', error);
          throw new Error('Failed to initialize token');
        }
      }

      
    
      async getTokenId(): Promise<TokenId> {
        if (!this.tokenId) {
          await this.initializeTokenIfNeeded();
        }
        return this.tokenId!;
      }
    
      async issueCredential(metadata: CredentialMetadata): Promise<{
        credentialId: string;
        transactionId: string;
      }> {
        try {
          const tokenId = await this.getTokenId();
          const recipientId = AccountId.fromString(metadata.recipient);
    
          // Check token association
          const isAssociated = await this.isAccountAssociatedWithToken(metadata.recipient);
          if (!isAssociated) {
            throw new Error(`Account ${metadata.recipient} needs to be associated with token ${tokenId.toString()}. Please associate your account first.`);
          }
    
          // Store metadata on Hedera File Service
          const fileCreateTx = await this.executeWithRetry(async () => {
            const tx = new FileCreateTransaction()
              .setKeys([this.adminKey])
              .setContents(JSON.stringify(metadata))
              .setMaxTransactionFee(new Hbar(2));
    
            return tx.freezeWith(this.client);
          });
    
          const signedFileTx = await fileCreateTx.sign(this.adminKey);
          const fileResponse = await signedFileTx.execute(this.client);
          const fileReceipt = await fileResponse.getReceipt(this.client);
          const fileId = fileReceipt.fileId!;
    
          // Mint NFT with file ID as metadata using TextEncoder instead of Buffer
          const mintTx = await this.executeWithRetry(async () => {
            const tx = new TokenMintTransaction()
              .setTokenId(tokenId)
              .setMetadata([stringToUint8Array(fileId.toString())])
              .setMaxTransactionFee(new Hbar(2));
    
            return tx.freezeWith(this.client);
          });
    
          const signedMintTx = await mintTx.sign(this.adminKey);
          const mintResponse = await signedMintTx.execute(this.client);
          const mintReceipt = await mintResponse.getReceipt(this.client);
    
          // Transfer NFT to recipient
          const transferTx = await this.executeWithRetry(async () => {
            const tx = new TransferTransaction()
              .addNftTransfer(
                tokenId,
                mintReceipt.serials[0],
                this.client.operatorAccountId!,
                recipientId
              )
              .setMaxTransactionFee(new Hbar(2));
    
            return tx.freezeWith(this.client);
          });
    
          const signedTransferTx = await transferTx.sign(this.adminKey);
          const transferResponse = await signedTransferTx.execute(this.client);
          const transferReceipt = await transferResponse.getReceipt(this.client);
    
          return {
            credentialId: `${tokenId.toString()}:${mintReceipt.serials[0]}`,
            transactionId: transferResponse.transactionId.toString(),
          };
        } catch (error) {
          console.error('Error issuing credential:', error);
          throw error;
        }
      }
    
      async getTokenAssociateTransaction(accountId: string): Promise<string> {
        try {
          const tokenId = await this.getTokenId();
          const transaction = await new TokenAssociateTransaction()
            .setAccountId(AccountId.fromString(accountId))
            .setTokenIds([tokenId])
            .setMaxTransactionFee(new Hbar(30))
            .freezeWith(this.client);
    
          // Get the transaction bytes
          const txBytes = transaction.toBytes();
          
          // Return the transaction bytes as a hex string
          return Buffer.from(txBytes).toString('hex');
        } catch (error) {
          console.error('Error creating association transaction:', error);
          throw new Error('Failed to create token association transaction');
        }
      }
   
      async verifyCredential(credentialId: string): Promise<{
        isValid: boolean;
        metadata?: CredentialMetadata;
      }> {
        try {
          const [tokenIdStr, serialNumber] = credentialId.split(':');
          const tokenId = TokenId.fromString(tokenIdStr);
          const serialNum = parseInt(serialNumber);
    
          const nftInfo = await this.executeWithRetry(async () => {
            const query = new TokenNftInfoQuery()
              .setNftId(new NftId(tokenId, serialNum));
            
            return query.execute(this.client);
          });
    
          if (!nftInfo || nftInfo.length === 0) {
            return { isValid: false };
          }
    
          // Handle metadata using TextDecoder
          const metadataBytes = nftInfo[0].metadata;
          if (!metadataBytes) {
            return { isValid: false };
          }
          
          const fileIdStr = new TextDecoder().decode(metadataBytes);
          const fileId = FileId.fromString(fileIdStr);
    
          const fileContents = await this.executeWithRetry(async () => {
            return new FileContentsQuery()
              .setFileId(fileId)
              .execute(this.client);
          });
    
          const metadata = JSON.parse(new TextDecoder().decode(fileContents));
    
          return {
            isValid: true,
            metadata
          };
        } catch (error) {
          console.error('Error verifying credential:', error);
          return { isValid: false };
        }
      }
  
  async getCredentialsForAccount(accountId: string): Promise<Array<{
    id: string;
    metadata: CredentialMetadata;
    status: 'verified' | 'pending' | 'revoked';
  }>> {
    try {
      const accountIdObj = AccountId.fromString(accountId);
      const tokenId = await this.getTokenId();

      const accountInfo = await this.executeWithRetry(async () => {
        return new AccountInfoQuery()
          .setAccountId(accountIdObj)
          .execute(this.client);
      });

      const nftInfos = await Promise.all(
        accountInfo.tokenRelationships
          .get(tokenId)
          ?.nftSerials
          .map(async (serial) => {
            try {
              const info = await this.executeWithRetry(async () => {
                return new TokenNftInfoQuery()
                  .setNftId(new NftId(tokenId, serial))
                  .execute(this.client);
              });
              
              if (info && info.length > 0) {
                const credentialId = `${tokenId.toString()}:${serial}`;
                const verification = await this.verifyCredential(credentialId);
                
                return {
                  id: credentialId,
                  metadata: verification.metadata!,
                  status: verification.isValid ? 'verified' : 'revoked'
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching NFT info for serial ${serial}:`, error);
              return null;
            }
          }) || []
      );

      return nftInfos.filter((info): info is NonNullable<typeof info> => info !== null);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw new Error('Failed to fetch credentials');
    }
  }

    async revokeCredential(credentialId: string): Promise<boolean> {
      try {
        const [tokenIdStr, serialNumber] = credentialId.split(':');
        const tokenId = TokenId.fromString(tokenIdStr);
  
        const burnTx = await this.executeWithRetry(async () => {
          const tx = new TokenBurnTransaction()
            .setTokenId(tokenId)
            .setSerials([parseInt(serialNumber)])
            .setMaxTransactionFee(new Hbar(30));
  
          return tx.freezeWith(this.client);
        });
  
        const signedBurnTx = await burnTx.sign(this.adminKey);
        const burnResponse = await signedBurnTx.execute(this.client);
        await burnResponse.getReceipt(this.client);
  
        return true;
      } catch (error) {
        console.error('Error revoking credential:', error);
        return false;
      }
    }

    async createAssociateTransaction(accountId: string): Promise<TransactionResponse> {
        try {
          if (await this.isAccountAssociatedWithToken(accountId)) {
            throw new Error('Account is already associated with token');
          }
    
          const transaction = await new TokenAssociateTransaction()
            .setAccountId(AccountId.fromString(accountId))
            .setTokenIds([this.tokenId!])
            .setMaxTransactionFee(new Hbar(30))
            .freezeWith(this.client)
            .execute(this.client);
    
          return transaction;
        } catch (error) {
          console.error('Error creating association transaction:', error);
          throw new Error('Failed to create token association transaction');
        }
      }
    
      async checkAssociationStatus(accountId: string, attempts: number = 10, delay: number = 1000): Promise<boolean> {
        for (let i = 0; i < attempts; i++) {
          try {
            const isAssociated = await this.isAccountAssociatedWithToken(accountId);
            if (isAssociated) {
              return true;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
          } catch (error) {
            console.warn(`Attempt ${i + 1} failed:`, error);
          }
        }
        return false;
      }
    
    
  }
  
  export const hederaService = new HederaCredentialService();

