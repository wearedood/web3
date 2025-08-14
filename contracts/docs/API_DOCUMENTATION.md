# Base API Documentation

## Overview
Comprehensive API documentation for Base blockchain integration toolkit.

## Authentication
```javascript
const baseAPI = new BaseAPI({
  apiKey: process.env.BASE_API_KEY,
  network: 'mainnet' // or 'testnet'
});
```

## Core Methods

### Network Operations

#### `getNetworkInfo()`
Retrieve current Base network information.

```javascript
const networkInfo = await baseAPI.getNetworkInfo();
console.log(networkInfo);
// {
//   chainId: 8453,
//   name: 'Base',
//   rpcUrl: 'https://mainnet.base.org',
//   blockNumber: 12345678
// }
```

#### `getGasPrice()`
Get current gas price recommendations.

```javascript
const gasPrice = await baseAPI.getGasPrice();
console.log(gasPrice);
// {
//   slow: '1000000000',
//   standard: '1500000000',
//   fast: '2000000000'
// }
```

### Account Management

#### `getBalance(address)`
Retrieve ETH balance for an address.

```javascript
const balance = await baseAPI.getBalance('0x742d35Cc6634C0532925a3b8D');
console.log(balance); // '1.234567890123456789'
```

#### `getTokenBalance(address, tokenAddress)`
Get ERC20 token balance.

```javascript
const tokenBalance = await baseAPI.getTokenBalance(
  '0x742d35Cc6634C0532925a3b8D',
  '0xA0b86a33E6441E8C8C7014C0532925a3b8D'
);
```

### Transaction Operations

#### `sendTransaction(params)`
Send a transaction on Base network.

```javascript
const txHash = await baseAPI.sendTransaction({
  to: '0x742d35Cc6634C0532925a3b8D',
  value: '1000000000000000000', // 1 ETH in wei
  gasLimit: '21000',
  gasPrice: '1500000000'
});
```

#### `deployContract(bytecode, abi, constructorArgs)`
Deploy smart contract to Base.

```javascript
const contractAddress = await baseAPI.deployContract(
  bytecode,
  abi,
  ['param1', 'param2']
);
```

### DeFi Integration

#### `swapTokens(params)`
Execute token swap via Uniswap V3 on Base.

```javascript
const swapResult = await baseAPI.swapTokens({
  tokenIn: '0xA0b86a33E6441E8C8C7014C0532925a3b8D',
  tokenOut: '0xB1c86a33E6441E8C8C7014C0532925a3b8D',
  amountIn: '1000000000000000000',
  slippage: 0.5 // 0.5%
});
```

#### `addLiquidity(params)`
Add liquidity to Uniswap V3 pool.

```javascript
const liquidityResult = await baseAPI.addLiquidity({
  token0: '0xA0b86a33E6441E8C8C7014C0532925a3b8D',
  token1: '0xB1c86a33E6441E8C8C7014C0532925a3b8D',
  amount0: '1000000000000000000',
  amount1: '2000000000000000000',
  fee: 3000 // 0.3%
});
```

### NFT Operations

#### `mintNFT(params)`
Mint NFT on Base network.

```javascript
const nftResult = await baseAPI.mintNFT({
  contractAddress: '0xC2c86a33E6441E8C8C7014C0532925a3b8D',
  to: '0x742d35Cc6634C0532925a3b8D',
  tokenURI: 'https://api.example.com/metadata/1'
});
```

#### `transferNFT(params)`
Transfer NFT between addresses.

```javascript
const transferResult = await baseAPI.transferNFT({
  contractAddress: '0xC2c86a33E6441E8C8C7014C0532925a3b8D',
  from: '0x742d35Cc6634C0532925a3b8D',
  to: '0xD3d86a33E6441E8C8C7014C0532925a3b8D',
  tokenId: '1'
});
```

### Bridge Operations

#### `bridgeToEthereum(params)`
Bridge assets from Base to Ethereum.

```javascript
const bridgeResult = await baseAPI.bridgeToEthereum({
  token: '0xA0b86a33E6441E8C8C7014C0532925a3b8D',
  amount: '1000000000000000000',
  recipient: '0x742d35Cc6634C0532925a3b8D'
});
```

#### `bridgeFromEthereum(params)`
Bridge assets from Ethereum to Base.

```javascript
const bridgeResult = await baseAPI.bridgeFromEthereum({
  token: '0xA0b86a33E6441E8C8C7014C0532925a3b8D',
  amount: '1000000000000000000',
  recipient: '0x742d35Cc6634C0532925a3b8D'
});
```

### Staking Operations

#### `stakeTokens(params)`
Stake tokens in Base staking contract.

```javascript
const stakeResult = await baseAPI.stakeTokens({
  contractAddress: '0xE4e86a33E6441E8C8C7014C0532925a3b8D',
  amount: '1000000000000000000',
  duration: 30 // days
});
```

#### `unstakeTokens(params)`
Unstake tokens and claim rewards.

```javascript
const unstakeResult = await baseAPI.unstakeTokens({
  contractAddress: '0xE4e86a33E6441E8C8C7014C0532925a3b8D',
  stakeId: '12345'
});
```

### Analytics

#### `getPortfolioValue(address)`
Calculate total portfolio value on Base.

```javascript
const portfolio = await baseAPI.getPortfolioValue('0x742d35Cc6634C0532925a3b8D');
console.log(portfolio);
// {
//   totalValue: '12345.67',
//   tokens: [...],
//   nfts: [...],
//   defiPositions: [...]
// }
```

#### `getTransactionHistory(address, limit)`
Retrieve transaction history.

```javascript
const history = await baseAPI.getTransactionHistory(
  '0x742d35Cc6634C0532925a3b8D',
  50
);
```

## Error Handling

```javascript
try {
  const result = await baseAPI.sendTransaction(params);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Not enough ETH for transaction');
  } else if (error.code === 'GAS_LIMIT_EXCEEDED') {
    console.log('Gas limit too low');
  } else {
    console.log('Transaction failed:', error.message);
  }
}
```

## Rate Limits
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- WebSocket connections: 10 concurrent

## Supported Networks
- Base Mainnet (Chain ID: 8453)
- Base Goerli Testnet (Chain ID: 84531)

## SDK Installation

```bash
npm install @base/web3-toolkit
# or
yarn add @base/web3-toolkit
```

## Environment Variables

```env
BASE_API_KEY=your_api_key_here
BASE_NETWORK=mainnet
BASE_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_private_key_here
```

## Examples

See the `/examples` directory for complete implementation examples:
- Token swapping bot
- NFT marketplace integration
- DeFi yield farming
- Cross-chain bridge automation

## Support

For technical support and questions:
- GitHub Issues: [web3/issues](https://github.com/wearedood/web3/issues)
- Documentation: [docs.base.org](https://docs.base.org)
- Discord: [Base Discord](https://discord.gg/base)
