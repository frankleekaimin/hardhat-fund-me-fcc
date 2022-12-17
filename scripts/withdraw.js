// script that allows us to fund our contracts quickly

async function main() {
    const { deployer } = await getNamedAccounts()
    fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Withdraw Contract...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Got it back!!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
