import { expect } from "chai";
import hre from "hardhat";
const ethers = hre.ethers;
import { Contract, Signer } from "ethers";
import { MultiSigWallet } from "../typechain-types/MultiSigWallet";
import { ExternalContract } from "../typechain-types";

describe("MultiSigWallet", () => {
  let wallet: MultiSigWallet;
  let externalContract: ExternalContract;
  let address: string;
  let externalContractaddress: string;
  let accounts: Signer[];

  before(async () => {
    accounts = await ethers.getSigners();
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const ExternalContract = await ethers.getContractFactory(
      "ExternalContract"
    );
    wallet = (await MultiSigWallet.deploy(
      [
        await accounts[0].getAddress(),
        await accounts[1].getAddress(),
        await accounts[2].getAddress(),
      ],
      2,
      "MyWallet"
    )) as MultiSigWallet;
    externalContract = (await ExternalContract.deploy()) as ExternalContract;
    address = await wallet.getAddress();
    externalContractaddress = await externalContract.getAddress();
    await accounts[0].sendTransaction({
      value: ethers.parseEther("30"),
      to: address,
    });
    await accounts[1].sendTransaction({
      value: ethers.parseEther("30"),
      to: externalContractaddress,
    });
  });

  describe("Deployment", () => {
    it("should deploy with correct approvers, quorum and name", async () => {
      const approvers = await wallet.getApprovers();
      const quorum = await wallet.quorum();
      const name = await wallet.name();

      expect(approvers.length).to.equal(3);
      expect(approvers[0]).to.equal(await accounts[0].getAddress());
      expect(approvers[1]).to.equal(await accounts[1].getAddress());
      expect(approvers[2]).to.equal(await accounts[2].getAddress());
      expect(quorum).to.equal(2);
      expect(name).to.equal("MyWallet");
    });

    it("should receive funds", async () => {
      const balance = await ethers.provider.getBalance(address);
      expect(ethers.formatEther(balance)).to.equal("30.0");
    });
  });

  describe("Transfers", () => {
    it("should create a transfer", async () => {
      await wallet
        .connect(accounts[0])
        .createTransfer(
          ethers.parseEther("0.1"),
          await accounts[2].getAddress()
        );
      const transfers = await wallet.getTransfers();

      expect(transfers.length).to.equal(1);
      expect(transfers[0].id).to.equal(0);
      expect(ethers.formatEther(transfers[0].amount)).to.equal("0.1");
      expect(transfers[0].to).to.equal(await accounts[2].getAddress());
      expect(transfers[0].approvals).to.equal(0);
      expect(transfers[0].sent).to.be.false;
    });

    it("should approve and send transfer if quorum reached", async () => {
      await wallet.connect(accounts[0]).approveTransfer(0);
      await wallet.connect(accounts[1]).approveTransfer(0);

      const transfers = await wallet.getTransfers();

      expect(transfers[0].sent).to.be.true;
    });

    it("should not allow non-approver to create a transfer", async () => {
      await expect(
        wallet
          .connect(accounts[3])
          .createTransfer(
            ethers.parseEther("0.1"),
            await accounts[2].getAddress()
          )
      ).to.be.revertedWith("only approver allowed");
    });

    it("should not allow non-approver to approve a transfer", async () => {
      await expect(
        wallet.connect(accounts[3]).approveTransfer(0)
      ).to.be.revertedWith("only approver allowed");
    });

    it("should not approve transfer twice by the same approver", async () => {
      await wallet
        .connect(accounts[0])
        .createTransfer(
          ethers.parseEther("0.1"),
          await accounts[2].getAddress()
        );
      await wallet.connect(accounts[0]).approveTransfer(1);
      await expect(
        wallet.connect(accounts[0]).approveTransfer(1)
      ).to.be.revertedWith("cannot approve transfer twice");
    });

    it("should not approve a transfer that has already been sent", async () => {
      await wallet
        .connect(accounts[0])
        .createTransfer(
          ethers.parseEther("0.1"),
          await accounts[2].getAddress()
        );
      await wallet.connect(accounts[0]).approveTransfer(2);
      await wallet.connect(accounts[1]).approveTransfer(2);

      await expect(
        wallet.connect(accounts[2]).approveTransfer(2)
      ).to.be.revertedWith("Transfer has already been sent");
    });
  });

  describe("Transactions", () => {
    it("should create a transaction", async () => {
      const data = wallet.interface.encodeFunctionData("name");
      await wallet
        .connect(accounts[0])
        .createTransaction(await accounts[1].getAddress(), data);

      const transaction = await wallet.getTransaction(1);
      expect(transaction.id).to.equal(1);
      expect(transaction.to).to.equal(await accounts[1].getAddress());
      expect(transaction.data).to.equal(data);
      expect(transaction.approvals).to.equal(1);
      expect(transaction.executed).to.be.false;
    });

    it("should approve and execute transaction if quorum reached", async () => {
      const data = wallet.interface.encodeFunctionData("name");
      await wallet
        .connect(accounts[1])
        .createTransaction(address, data);
      await wallet.connect(accounts[2]).approveTransaction(2);

      const transaction = await wallet.getTransaction(2);
      expect(transaction.executed).to.be.true;
    });

    it("should not allow non-approver to create a transaction", async () => {
      const data = wallet.interface.encodeFunctionData("name");
      await expect(
        wallet
          .connect(accounts[3])
          .createTransaction(await accounts[1].getAddress(), data)
      ).to.be.revertedWith("only approver allowed");
    });

    it("should not allow non-approver to approve a transaction", async () => {
      await expect(
        wallet.connect(accounts[3]).approveTransaction(1)
      ).to.be.revertedWith("only approver allowed");
    });

    it("should not approve transaction twice by the same approver", async () => {
      const data = wallet.interface.encodeFunctionData("name");
      await wallet
        .connect(accounts[0])
        .createTransaction(await accounts[1].getAddress(), data);
      await expect(
        wallet.connect(accounts[0]).approveTransaction(3)
      ).to.be.revertedWith("Cannot approve transaction twice");
    });

    it("should not approve a transaction that has already been executed", async () => {
      const data = wallet.interface.encodeFunctionData("name");
      await wallet
        .connect(accounts[0])
        .createTransaction(await accounts[1].getAddress(), data);
      await wallet.connect(accounts[1]).approveTransaction(4);

      await expect(
        wallet.connect(accounts[2]).approveTransaction(4)
      ).to.be.revertedWith("Transaction has already been executed");
    });
    it("should expect correct result when excuting externat contract functions", async () => {
        const withdrawalAdress = await accounts[0].getAddress();
        const amounttoSend = ethers.parseEther("1");
        const balanceOfAccount1Before = await ethers.provider.getBalance(
          withdrawalAdress
        );
        const data = externalContract.interface.encodeFunctionData("withdraw", [
          withdrawalAdress,
          amounttoSend,
        ]);
        await wallet
          .connect(accounts[1])
          .createTransaction(externalContractaddress, data);
        await wallet.connect(accounts[2]).approveTransaction(5);
  
        const balanceOfAccount1After = await ethers.provider.getBalance(
          withdrawalAdress
        );
  
        expect(balanceOfAccount1Before + amounttoSend).equal(
          balanceOfAccount1After
        );
      });
  });
});
