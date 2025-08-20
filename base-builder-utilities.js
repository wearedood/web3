/**
 * Base Builder Utilities - Advanced toolkit for Base ecosystem development
 * Optimized for Builder Rewards Program and Base L2 integration
 * @author wearedood
 * @version 2.0.0
 */

import { ethers } from 'ethers';
import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { base, baseGoerli } from 'viem/chains';

// Base Network Configuration
export const BASE_CONFIG = {
  mainnet: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    bridgeUrl: 'https://bridge.base.org',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  testnet: {
    chainId: 84531,
    name: 'Base Goerli',
    rpcUrl: 'https://goerli.base.org',
    explorerUrl: 'https://goerli.basescan.org',
    bridgeUrl: 'https://bridge.base.org',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
  }
};

// Builder Rewards Tracking
export class BaseBuilderTracker {
  constructor(network = 'mainnet') {
    this.config = BASE_CONFIG[network];
    this.client = createPublicClient({
      chain: network === 'mainnet' ? base : baseGoerli,
      transport: http(this.config.rpcUrl)
    });
  }

  /**
   * Track builder activity metrics for rewards calculation
   */
  async getBuilderMetrics(address) {
    try {
      const [balance, txCount, contractsDeployed] = await Promise.all([
        this.client.getBalance({ address }),
        this.client.getTransactionCount({ address }),
        this.getContractsDeployed(address)
      ]);

      return {
        address,
        balance: formatEther(balance),
        transactionCount: txCount,
        contractsDeployed,
        network: this.config.name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching builder metrics:', error);
      throw error;
    }
  }

  /**
   * Get contracts deployed by address (simplified implementation)
   */
  async getContractsDeployed(address) {
    // This would typically require indexing service or event logs
    // Placeholder implementation for demonstration
    return Math.floor(Math.random() * 10) + 1;
  }
}

// Base DeFi Integration Utilities
export class BaseDeFiUtils {
  constructor(network = 'mainnet') {
    this.config = BASE_CONFIG[network];
    this.tracker = new BaseBuilderTracker(network);
  }

  /**
   * Calculate optimal gas fees for Base transactions
   */
  async getOptimalGasFees() {
    try {
      const gasPrice = await this.tracker.client.getGasPrice();
      
      return {
        standard: gasPrice,
        fast: gasPrice * BigInt(110) / BigInt(100), // 10% higher
        instant: gasPrice * BigInt(125) / BigInt(100), // 25% higher
        network: this.config.name
      };
    } catch (error) {
      console.error('Error calculating gas fees:', error);
      throw error;
    }
  }

  /**
   * Bridge asset estimation between Ethereum and Base
   */
  async estimateBridgeCost(amount, token = 'ETH') {
    const bridgeFee = parseEther('0.001'); // Approximate bridge fee
    const gasCost = await this.getOptimalGasFees();
    
    return {
      amount: formatEther(amount),
      bridgeFee: formatEther(bridgeFee),
      estimatedGas: formatEther(gasCost.standard * BigInt(21000)),
      totalCost: formatEther(amount + bridgeFee + (gasCost.standard * BigInt(21000))),
      token
    };
  }
}

// Base Ecosystem Analytics
export class BaseAnalytics {
  constructor() {
    this.mainnetTracker = new BaseBuilderTracker('mainnet');
    this.testnetTracker = new BaseBuilderTracker('testnet');
  }

  /**
   * Get comprehensive Base ecosystem statistics
   */
  async getEcosystemStats() {
    try {
      const [mainnetBlock, testnetBlock] = await Promise.all([
        this.mainnetTracker.client.getBlockNumber(),
        this.testnetTracker.client.getBlockNumber()
      ]);

      return {
        mainnet: {
          latestBlock: Number(mainnetBlock),
          network: 'Base Mainnet',
          chainId: BASE_CONFIG.mainnet.chainId
        },
        testnet: {
          latestBlock: Number(testnetBlock),
          network: 'Base Goerli',
          chainId: BASE_CONFIG.testnet.chainId
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching ecosystem stats:', error);
      throw error;
    }
  }

  /**
   * Monitor builder rewards eligibility
   */
  async checkRewardsEligibility(address) {
    const metrics = await this.mainnetTracker.getBuilderMetrics(address);
    
    const eligibility = {
      hasMinimumActivity: metrics.transactionCount >= 10,
      hasDeployedContracts: metrics.contractsDeployed > 0,
      hasMinimumBalance: parseFloat(metrics.balance) >= 0.01,
      overallEligible: false
    };

    eligibility.overallEligible = 
      eligibility.hasMinimumActivity && 
      eligibility.hasDeployedContracts && 
      eligibility.hasMinimumBalance;

    return {
      address,
      eligibility,
      metrics,
      recommendations: this.getRecommendations(eligibility)
    };
  }

  /**
   * Provide recommendations for improving builder score
   */
  getRecommendations(eligibility) {
    const recommendations = [];
    
    if (!eligibility.hasMinimumActivity) {
      recommendations.push('Increase transaction activity on Base network');
    }
    if (!eligibility.hasDeployedContracts) {
      recommendations.push('Deploy smart contracts to demonstrate building activity');
    }
    if (!eligibility.hasMinimumBalance) {
      recommendations.push('Maintain minimum ETH balance for gas fees');
    }
    
    if (eligibility.overallEligible) {
      recommendations.push('Continue consistent building activity for maximum rewards');
    }

    return recommendations;
  }
}

// Export utility instances
export const baseTracker = new BaseBuilderTracker();
export const baseDeFi = new BaseDeFiUtils();
export const baseAnalytics = new BaseAnalytics();

// Helper functions for common operations
export const utils = {
  /**
   * Format Base transaction URL
   */
  getTxUrl: (txHash, network = 'mainnet') => 
    `${BASE_CONFIG[network].explorerUrl}/tx/${txHash}`,

  /**
   * Format Base address URL
   */
  getAddressUrl: (address, network = 'mainnet') => 
    `${BASE_CONFIG[network].explorerUrl}/address/${address}`,

  /**
   * Check if address is valid Ethereum address
   */
  isValidAddress: (address) => /^0x[a-fA-F0-9]{40}$/.test(address),

  /**
   * Convert wei to ETH with proper formatting
   */
  formatBalance: (wei) => parseFloat(formatEther(wei)).toFixed(4),

  /**
   * Get current Base network status
   */
  getNetworkStatus: async (network = 'mainnet') => {
    const tracker = new BaseBuilderTracker(network);
    const blockNumber = await tracker.client.getBlockNumber();
    return {
      network: BASE_CONFIG[network].name,
      blockNumber: Number(blockNumber),
      status: 'active',
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  BASE_CONFIG,
  BaseBuilderTracker,
  BaseDeFiUtils,
  BaseAnalytics,
  baseTracker,
  baseDeFi,
  baseAnalytics,
  utils
};
