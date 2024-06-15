import hre from 'hardhat'

async function main() {

    const ExternalContract = await hre.ethers.getContractFactory("ExternalContract");
    const externalContract = await ExternalContract.deploy();
    
    console.log("externalContract deployed to:", externalContract.target);

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });