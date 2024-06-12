import { expect } from "chai";
import hre from "hardhat";
const ethers = hre.ethers;
import { Contract, Signer } from "ethers";
import { MultiSigWalletFactory } from "../typechain-types/MultiSigWalletFactory";
import { MultiSigWallet } from "../typechain-types/MultiSigWallet";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("MultiSigWalletFactory", () => {
  let factory: MultiSigWalletFactory;
  let accounts: Signer[];
  let approvers: string[];

  before(async () => {
    accounts = await ethers.getSigners();
    approvers = [
      await accounts[0].getAddress(),
      await accounts[1].getAddress(),
      await accounts[2].getAddress(),
    ];
    const MultiSigWalletFactory = await ethers.getContractFactory(
      "MultiSigWalletFactory"
    );
    factory = (await MultiSigWalletFactory.deploy()) as MultiSigWalletFactory;
  });

  describe("Deployment", () => {
    it("should deploy the factory contract", async () => {
      expect(await factory.getAddress()).to.properAddress;
    });
  });

  describe("Create Wallet", () => {
    it("should create a new MultiSigWallet and emit event", async () => {
      const quorum = 2;
      const name = "TestWallet";
      

      await expect(factory.createWallet(approvers, quorum, name)).to.emit(
        factory,
        "WalletCreated"
      ).withArgs(anyValue,approvers,quorum,name)
    });

    it("should track the wallets for each approver", async () => {
      const approver = approvers[0];
      const wallets = await factory.getWalletsForApprover(approver);
      expect(wallets.length).to.be.greaterThan(0);
      expect(wallets[0]).to.properAddress;
    });

    it("should revert if no approvers are provided", async () => {
      await expect(
        factory.createWallet([], 2, "InvalidWallet")
      ).to.be.revertedWith("Approvers required");
    });

    it("should revert if invalid quorum is provided", async () => {
      await expect(
        factory.createWallet(approvers, 0, "InvalidWallet")
      ).to.be.revertedWith("Invalid quorum");
      await expect(
        factory.createWallet(approvers, approvers.length + 1, "InvalidWallet")
      ).to.be.revertedWith("Invalid quorum");
    });
  });
});
