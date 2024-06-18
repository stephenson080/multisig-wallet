# MultiSig Wallet Project

This project demonstrates the basic usage of a MultiSig Wallet that can also interact with external Smart Contracts.

## Overview

The project includes:

- **MultiSig Wallet Contract**:
  The `MultiSigWallet` is a Solidity contract that enables a group of approvers to collectively manage and approve token transfers and transactions. It requires a quorum of approvals to execute any proposed action. Approvers can create and approve transfers and transactions, which are executed once the quorum is met. The contract tracks approvals and ensures that no single party can act alone, enhancing the security and collective management of funds.
- **MultiSig Wallet Factory Contract**:
  A contract that manages the creation and organization of multiple MultiSig wallets.
  The MultiSigWalletFactory contract enables the creation and management of multiple MultiSig wallets. The `createWallet` function takes a list of approvers, a quorum, and a wallet name to create a new MultiSigWallet instance. The `getWalletsForApprover` function retrieves all wallets associated with a specific approver. This contract streamlines the management and organization of multiple MultiSig wallets.
- **Sample Smart Contract (ExternalContract)**: A contract used to test the MultiSig wallet's transaction builder feature.

## Project Setup

Ensure you are in the contracts sub-folder, run the command below to install the project dependencies

```shell
npm install
```

or

```shell
yarn install
```

## Scripts

Useful scripts for interacting with the project:

1. Run Contracts Unit Tests:

```shell
npm run test
```

2. Deploy Sample External Smart Contract to Asset Chain:

```shell
npm run deploy:sample:assetchain_test
```

3. Deploy MultiSig Wallet Factory Smart Contract to Asset Chain:

```shell
npm run deploy:assetchain_test
```
These scripts facilitate testing, deployment, and interaction with the MultiSig wallets and external contracts.
