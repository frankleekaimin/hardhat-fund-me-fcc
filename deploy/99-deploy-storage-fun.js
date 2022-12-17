const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying FunWithStorage and waiting for confirmations...")
    const funWithStorage = await deploy("FunWithStorage", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(funWithStorage.address, [])
    }

    log("Logging storage...")
    for (let i = 0; i < 10; i++) {
        log(
            `Location ${i}: ${await ethers.provider.getStorageAt(
                funWithStorage.address,
                i
            )}`
        )
    }

    log("Logging myArray")
    for (let i = 0; i < 3; i++) {
        let array_data_pos = ethers.BigNumber.from(
            ethers.utils.keccak256(ethers.utils.hexZeroPad(2, 32)) // Index in memory
        )
            .add(i) // key of element in mapping
            .toHexString()
        // const array_data_pos = ethers.utils.hexDataSlice(ethers.utils.keccak256(2),-20)
        log(
            `Location Keccak(0x2)+${i}: ${await ethers.provider.getStorageAt(
                funWithStorage.address,
                array_data_pos
            )}`
        )
    }

    log("Logging MyMap")
    for (let i = 0; i < 3; i++) {
        let array_data_pos = ethers.BigNumber.from(
            ethers.utils.keccak256(
                ethers.utils
                    .hexZeroPad(i, 32) // key of element in mapping
                    .concat(ethers.utils.hexZeroPad(3, 32).slice(2)) // Index in memory
            )
        ).toHexString()
        // const array_data_pos = ethers.utils.hexDataSlice(ethers.utils.keccak256(2),-20)
        log(
            `Location Keccak(0x3+${i}): ${await ethers.provider.getStorageAt(
                funWithStorage.address,
                array_data_pos
            )}`
        )
    }

    // You can use this to trace!
    // const trace = await network.provider.send("debug_traceTransaction", [
    //     funWithStorage.transactionHash,
    // ])
    // for (structLog in trace.structLogs) {
    //     if (trace.structLogs[structLog].op == "SSTORE") {
    //         console.log(trace.structLogs[structLog])
    //     }
    // }
    // const firstelementLocation = ethers.utils.keccak256(
    //     "0x0000000000000000000000000000000000000000000000000000000000000002"
    // )
    // const arrayElement = await ethers.provider.getStorageAt(
    //     funWithStorage.address,
    //     firstelementLocation
    // )
    // log(`Location ${firstelementLocation}: ${arrayElement}`)

    // Can you write a function that finds the storage slot of the arrays and mappings?
    // And then find the data in those slots?
}

module.exports.tags = ["storage"]
