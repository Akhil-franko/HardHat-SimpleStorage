const { verifyMessage } = require("ethers/lib/utils")
const { ethers, run, network } = require("hardhat")

async function main() {
    // Deploying Contract

    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Contract Deployed to ${simpleStorage.address}`)

    //Checking if its in the Testnet and verifies it on Etherscan

    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        console.log("Waiting for block confirmations....")
        await verify(simpleStorage.address, [])
    }

    //Interacting With the contract

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is ${currentValue}`)
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is ${updatedValue}`)
}

//Function To Check if its already verified and then verifies it

async function verify(contractAddress, args) {
    console.log("Verfying Contract....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
