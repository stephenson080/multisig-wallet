import hre from 'hardhat'

async function main() {

    const MultiSigWalletFactory = await hre.ethers.getContractFactory("MultiSigWalletFactory");
    const multiSigWalletFactory = await MultiSigWalletFactory.deploy();
    
    console.log("multiSigWallet deployed to:", multiSigWalletFactory.target);

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });