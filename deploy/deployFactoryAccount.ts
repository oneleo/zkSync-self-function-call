import { utils, types, Wallet, Provider, EIP712Signer } from "zksync-web3"
import * as ethers from "ethers"
import { HardhatRuntimeEnvironment, HttpNetworkUserConfig } from "hardhat/types"
import { Deployer } from "@matterlabs/hardhat-zksync-deploy"

export default async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
    const rpcUrl = (hre.config.networks[hre.network.name] as HttpNetworkUserConfig).url
    const provider = new Provider(rpcUrl as string)
    const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider)
    const deployer = new Deployer(hre, wallet)
    const factoryArtifact = await deployer.loadArtifact("AAFactory")
    const aaArtifact = await deployer.loadArtifact("Account")

    const factory = await deployer.deploy(
        factoryArtifact,
        [utils.hashBytecode(aaArtifact.bytecode)],
        undefined,
        [aaArtifact.bytecode],
    )

    console.log(`AA factory address: ${factory.address}`)

    const aaFactory = new ethers.Contract(factory.address, factoryArtifact.abi, wallet)

    const owner = Wallet.createRandom().connect(provider)
    console.log("SC Account owner pk: ", owner.privateKey)

    const salt = ethers.constants.HashZero
    const tx = await aaFactory.deployAccount(salt, owner.address)
    await tx.wait()

    const abiCoder = new ethers.utils.AbiCoder()
    const accountAddress = utils.create2Address(
        factory.address,
        await aaFactory.aaBytecodeHash(),
        salt,
        abiCoder.encode(["address"], [owner.address]),
    )

    console.log(`SC Account deployed on address ${accountAddress}`)

    console.log("Funding smart contract account with some ETH")
    await (
        await wallet.sendTransaction({
            to: accountAddress,
            value: ethers.utils.parseEther("0.02"),
        })
    ).wait()

    // ++++++++++ ++++++++++ ++++++++++

    const accountContract = new ethers.Contract(accountAddress, aaArtifact.abi, owner)

    await executeCustomFunction(
        accountContract,
        provider,
        owner,
        "customFunction1",
        "customVariable",
    )

    // Note: This function is restricted by onlyBootloader,
    // allowing execution only by the Bootloader,
    // which will result in a revert.
    await executeCustomFunction(
        accountContract,
        provider,
        owner,
        "customFunction2",
        "customVariable",
    )

    // Note: This function is restricted by onlyAccount,
    // allowing execution only by Account,
    // ensuring successful execution.
    await executeCustomFunction(
        accountContract,
        provider,
        owner,
        "customFunction3",
        "customVariable",
    )

    // ++++++++++ ++++++++++ ++++++++++

    console.log(`Done!`)
}

async function executeCustomFunction(
    accountContract: ethers.Contract,
    provider: Provider,
    owner: Wallet,
    functionName: string,
    customVariableName: string,
) {
    const accountAddress = accountContract.address
    try {
        const tx = await accountContract.populateTransaction[functionName]()

        let modifiedTx = {
            ...tx,
            from: accountAddress,
            chainId: (await provider.getNetwork()).chainId,
            nonce: await provider.getTransactionCount(accountAddress),
            type: 113,
            customData: {
                gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            } as types.Eip712Meta,
            value: ethers.BigNumber.from(0),
        }

        console.log(`${functionName}Tx: ${JSON.stringify(modifiedTx, null, 2)}`)

        modifiedTx.gasPrice = await provider.getGasPrice()
        modifiedTx.gasLimit = await provider.estimateGas(modifiedTx)

        const signedTxHash = EIP712Signer.getSignedDigest(modifiedTx)
        const signature = ethers.utils.arrayify(
            ethers.utils.joinSignature(owner._signingKey().signDigest(signedTxHash)),
        )

        modifiedTx.customData = {
            ...modifiedTx.customData,
            customSignature: signature,
        }

        console.log(`Executing ${functionName}...`)
        const sentTx = await provider.sendTransaction(utils.serialize(modifiedTx))
        await sentTx.wait()

        const ownerBalance = await provider.getBalance(await owner.getAddress())
        console.log(`ownerBalance: ${ownerBalance}`)

        const accountBalance = await provider.getBalance(accountAddress)
        console.log(`accountBalance: ${accountBalance}`)

        const customVariable = await accountContract[customVariableName]()
        console.log(`${customVariableName}: ${customVariable}`)
    } catch (error) {
        console.error(`Error in ${functionName}: ${error}`)
    }
}
