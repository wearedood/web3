/**
 * Token Swap Module
 * Basic token swap functionality for Web3 Development Toolkit
 * Integrates with Uniswap V3 for decentralized token swapping
 */

import { ethers } from 'ethers';
import { Contract, ContractFactory } from 'ethers';

// Uniswap V3 Router Contract Address on Base
const UNISWAP_V3_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481';

// Basic ERC20 ABI for token interactions
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

// Uniswap V3 Router ABI (simplified)
const UNISWAP_V3_ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
];

/**
 * TokenSwap Class
 * Handles basic token swapping functionality
 */
export class TokenSwap {
  constructor(provider, wallet = null) {
    this.provider = provider;
    this.wallet = wallet;
    this.uniswapRouter = new Contract(UNISWAP_V3_ROUTER, UNISWAP_V3_ROUTER_ABI, wallet || provider);
  }

  /**
   * Swap tokens using Uniswap V3
   * @param {string} tokenIn - Input token address
   * @param {string} tokenOut - Output token address
   * @param {number} amountIn - Amount of input tokens
   * @param {number} slippageTolerance - Slippage tolerance (0.5 = 0.5%)
   * @param {number} fee - Pool fee tier (3000 = 0.3%, 500 = 0.05%, 10000 = 1%)
   * @returns {Promise<Object>} Transaction result
   */
  async swapTokens(tokenIn, tokenOut, amountIn, slippageTolerance = 0.5, fee = 3000) {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized for token swap');
      }

      // Validate inputs
      if (!tokenIn || !tokenOut || !amountIn) {
        throw new Error('Missing required parameters: tokenIn, tokenOut, amountIn');
      }

      // Convert amount to wei (assuming 18 decimals)
      const amountInWei = ethers.parseEther(amountIn.toString());
      
      // Calculate minimum amount out with slippage protection
      const amountOutMinimum = amountInWei * BigInt(Math.floor((100 - slippageTolerance) * 100)) / BigInt(10000);

      // Get token contract for approval
      const tokenContract = new Contract(tokenIn, ERC20_ABI, this.wallet);
      
      // Check current allowance
      const currentAllowance = await tokenContract.allowance(this.wallet.address, UNISWAP_V3_ROUTER);
      
      // Approve tokens if needed
      if (currentAllowance < amountInWei) {
        console.log('Approving tokens for swap...');
        const approveTx = await tokenContract.approve(UNISWAP_V3_ROUTER, amountInWei);
        await approveTx.wait();
        console.log('Token approval confirmed');
      }

      // Prepare swap parameters
      const swapParams = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: fee,
        recipient: this.wallet.address,
        deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
        amountIn: amountInWei,
        amountOutMinimum: amountOutMinimum,
        sqrtPriceLimitX96: 0 // No price limit
      };

      console.log('Executing token swap...');
      const swapTx = await this.uniswapRouter.exactInputSingle(swapParams);
      
      console.log('Waiting for swap confirmation...');
      const receipt = await swapTx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        amountIn: amountIn,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        slippage: slippageTolerance
      };

    } catch (error) {
      console.error('Token swap failed:', error);
      return {
        success: false,
        error: error.message,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn: amountIn
      };
    }
  }

  /**
   * Get token balance
   * @param {string} tokenAddress - Token contract address
   * @param {string} walletAddress - Wallet address to check
   * @returns {Promise<string>} Token balance
   */
  async getTokenBalance(tokenAddress, walletAddress) {
    try {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await tokenContract.balanceOf(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0';
    }
  }

  /**
   * Get token information
   * @param {string} tokenAddress - Token contract address
   * @returns {Promise<Object>} Token info (symbol, decimals)
   */
  async getTokenInfo(tokenAddress) {
    try {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const [symbol, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);
      
      return {
        address: tokenAddress,
        symbol: symbol,
        decimals: decimals
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      return {
        address: tokenAddress,
        symbol: 'UNKNOWN',
        decimals: 18
      };
    }
  }
}

// Export default instance
export default TokenSwap;
