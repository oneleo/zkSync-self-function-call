import "@matterlabs/hardhat-zksync-deploy"
import "@matterlabs/hardhat-zksync-solc"

import "tsconfig-paths/register"

import dotenv from "dotenv"
dotenv.config()

const INFURA_TOKEN = process.env.INFURA_TOKEN || ""

module.exports = {
    zksolc: {
        version: "1.3.10",
        compilerSource: "binary",
        settings: {
            //compilerPath: "zksolc",  // optional. Ignored for compilerSource "docker". Can be used if compiler is located in a specific folder
            experimental: {
                dockerImage: "matterlabs/zksolc", // Deprecated! use, compilerSource: "binary"
                tag: "latest", // Deprecated: used for compilerSource: "docker"
            },
            libraries: {}, // optional. References to non-inlinable libraries
            isSystem: false, // optional.  Enables Yul instructions available only for zkSync system contracts and libraries
            forceEvmla: false, // optional. Falls back to EVM legacy assembly if there is a bug with Yul
            optimizer: {
                enabled: true, // optional. True by default
                mode: "3", // optional. 3 by default, z to optimize bytecode size
            },
        },
    },
    defaultNetwork: "zkTestnet",
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_TOKEN}`, // The Ethereum Web3 RPC URL (optional).
            zksync: false, // Set to false to target other networks.
        },
        zkTestnet: {
            url: "https://testnet.era.zksync.dev", // The testnet RPC URL of zkSync Era network.
            ethNetwork: "goerli", // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `goerli`)
            zksync: true,
        },
    },
    // defaultNetwork: "zkTestnet", // optional (if not set, use '--network zkTestnet')
    solidity: {
        version: "0.8.13",
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
}