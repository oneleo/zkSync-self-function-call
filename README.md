# zkSync Contracts

## Set-up

```sh
$ yarn install --frozen-lockfile
$ cp .env.example .env
$ yarn build
```

Compile the Contracts

```sh
$ yarn run compile
```

> -   If you want to develop in the local (for test or run scripts), instead of Testnet, you need to run the local devnet([matter-labs/local-setup](https://github.com/matter-labs/local-setup)) first.
> -   After run the local devnet, you should wait for local devnet to run the node about 10 mins.
> -   Ensure [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/) is installed before running the code.
>
> ```sh
> # In another folder
> $ git clone https://github.com/matter-labs/local-setup.git
> $ cd local-setup
> $ ./start.sh
> ```

## Scripts

In the zkSync-hardhat-plugin, we should run the scripts with the `$ yarn hardhat deploy-zksync`, it will run the specified script in the `deploy` folder:

```sh
$ yarn hardhat deploy-zksync --network <network_name> --script scripts/<script_name>.ts
```

`<network_name>` could be:

-   `zkSyncEraTestnet`: zkSync Era TestNet
-   `zkSyncLocal`: zkSync Local Devnet

In this repo, you can use the yarn command to run the scripts by choosing different netowrk:

```JSON
"scripts": {
    "execute:local": "hardhat deploy-zksync --network zkSyncLocal --script",
    "execute:eraGoerli": "hardhat deploy-zksync --network zkSyncEra --script"
}
```

### Deploy the Account contract and trigger the self function on a local testnet

```sh
$ yarn run execute:local deployFactoryAccount.ts
>
yarn run v1.22.22
$ hardhat deploy-zksync --network zkSyncLocal --script deployFactoryAccount.ts


AA factory address: 0x011DDA7296ABaDd4E06Ca51a91119c2288f91eB9
SC Account owner pk:  0x5d663595161328617e8976ef6ffd57a75c7a0b3db5e6bc338413b9965ba4f097
SC Account deployed on address 0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA
Funding smart contract account with some ETH
customFunction1Tx: {
  "data": "0xa6be9206",
  "to": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "from": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "chainId": 270,
  "nonce": 0,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Executing customFunction1...
ownerBalance: 0
accountBalance: 19991087600000000
customVariable: 1
customFunction2Tx: {
  "data": "0x0c4d0e0d",
  "to": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "from": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "chainId": 270,
  "nonce": 1,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Error in customFunction2: Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted", method="estimateGas", transaction={"from":"0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA","gasPrice":{"type":"BigNumber","hex":"0x05f5e100"},"to":"0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA","value":{"type":"BigNumber","hex":"0x00"},"data":"0x0c4d0e0d","type":113,"accessList":null,"customData":{"gasPerPubdata":50000}}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"error\":{\"code\":3,\"message\":\"execution reverted\",\"data\":\"0x\"},\"id\":111}","error":{"code":3,"data":"0x"},"requestBody":"{\"method\":\"eth_estimateGas\",\"params\":[{\"gasPrice\":\"0x5f5e100\",\"type\":\"0x71\",\"value\":\"0x0\",\"from\":\"0x05c465e78c4d086ec8b06a07d9acae959cfcdcca\",\"to\":\"0x05c465e78c4d086ec8b06a07d9acae959cfcdcca\",\"data\":\"0x0c4d0e0d\",\"eip712Meta\":{\"gasPerPubdata\":\"0xc350\"}}],\"id\":111,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"http://localhost:3050"}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.2)
customFunction3Tx: {
  "data": "0xd08a2f60",
  "to": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "from": "0x05c465E78C4D086EC8B06a07D9acae959cfCdCcA",
  "chainId": 270,
  "nonce": 1,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Executing customFunction3...
ownerBalance: 0
accountBalance: 19983438800000000
customVariable: 3
Done!
✨  Done in 6.51s.
```

### Deploy the Account contract and trigger the self function on a ZKsync Sepolia testnet

-   Edit `.env` file

```sh
$ nano .env

### .env ###
ALCHEMY_API_KEY=<YOUR_ALCHEMY_KEY>
PRIVATE_KEY=<YOUR_PRIVATE_KEY_ON_ZKSYNC_SEPOLIA>
###
```

-   Use this [Portal](https://portal.zksync.io/bridge/?network=sepolia) to bridge Sepolia ETH to ZkSync Era Testnet

```sh
$ yarn run execute:testnet deployFactoryAccount.ts
>
yarn run v1.22.22
$ hardhat deploy-zksync --network zkSyncEraTestnet --script deployFactoryAccount.ts


AA factory address: 0xD66F946563b8ceD82881b6065aD55a7De205581e
SC Account owner pk:  0x93ab58bbec827ef6b34cff85b2c67cc692831c5623fb635ca815ba0663f27621
SC Account deployed on address 0x33dAd09654CCf96d913bb6fd15E02732Be980E73
Funding smart contract account with some ETH
customFunction1Tx: {
  "data": "0xa6be9206",
  "to": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "from": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "chainId": 300,
  "nonce": 0,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Executing customFunction1...
ownerBalance: 0
accountBalance: 19997077725000000
customVariable: 1
customFunction2Tx: {
  "data": "0x0c4d0e0d",
  "to": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "from": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "chainId": 300,
  "nonce": 1,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Error in customFunction2: Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted", method="estimateGas", transaction={"from":"0x33dAd09654CCf96d913bb6fd15E02732Be980E73","gasPrice":{"type":"BigNumber","hex":"0x017d7840"},"to":"0x33dAd09654CCf96d913bb6fd15E02732Be980E73","value":{"type":"BigNumber","hex":"0x00"},"data":"0x0c4d0e0d","type":113,"accessList":null,"customData":{"gasPerPubdata":50000}}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"id\":105,\"error\":{\"code\":3,\"message\":\"execution reverted\",\"data\":\"0x\"}}","error":{"code":3,"data":"0x"},"requestBody":"{\"method\":\"eth_estimateGas\",\"params\":[{\"gasPrice\":\"0x17d7840\",\"type\":\"0x71\",\"value\":\"0x0\",\"from\":\"0x33dad09654ccf96d913bb6fd15e02732be980e73\",\"to\":\"0x33dad09654ccf96d913bb6fd15e02732be980e73\",\"data\":\"0x0c4d0e0d\",\"eip712Meta\":{\"gasPerPubdata\":\"0xc350\"}}],\"id\":105,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"https://zksync-sepolia.g.alchemy.com/v2/rJmO9B4C07KhdnE_9Aeos3_LilLAwfuQ"}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.2)
customFunction3Tx: {
  "data": "0xd08a2f60",
  "to": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "from": "0x33dAd09654CCf96d913bb6fd15E02732Be980E73",
  "chainId": 300,
  "nonce": 1,
  "type": 113,
  "customData": {
    "gasPerPubdata": 50000
  },
  "value": {
    "type": "BigNumber",
    "hex": "0x00"
  }
}
Executing customFunction3...
ownerBalance: 0
accountBalance: 19995173950000000
customVariable: 3
Done!
✨  Done in 31.57s.
```

---

## FAQ

-   [zkSync Era Account Abstraction Q&A](https://hackmd.io/@ChiHaoLu/zkSync-AA-QnA)

---

## Reference

### Tutorial

-   [matter-labs/era-tutorial-examples](https://github.com/matter-labs/era-tutorial-examples/tree/main/local-setup-testing)
-   [matter-labs/custom-paymaster-tutorial](https://github.com/matter-labs/custom-paymaster-tutorial)
-   [matter-labs/custom-aa-tutorial](https://github.com/matter-labs/custom-aa-tutorial/tree/main)
-   [matter-labs/daily-spendlimit-tutorial](https://github.com/matter-labs/daily-spendlimit-tutorial)
-   [matter-labs/l2-intro-demo](https://github.com/matter-labs/l2-intro-demo)
-   [matter-labs/l2-intro-ethdenver](https://github.com/matter-labs/l2-intro-ethdenver)
-   [JackHamer09/zkSync-era-Hardhat-example](https://github.com/JackHamer09/zkSync-era-Hardhat-example)
-   [miguelmota/zksync-messenger-l2-to-l1-example](https://github.com/miguelmota/zksync-messenger-l2-to-l1-example)

### Important links

-   Testnet network info
    -   Network Name: zkSync Era Testnet
    -   RPC URL: https://testnet.era.zksync.dev
    -   Chain ID: 280
    -   Currency Symbol: ETH
    -   Block Explorer URL: https://goerli.explorer.zksync.io/
    -   WebSocket URL: wss://testnet.era.zksync.dev/ws
-   Mainnet network info
    -   Network Name: zkSync Era Mainnet
    -   RPC URL: https://mainnet.era.zksync.io
    -   Chain ID: 324
    -   Currency Symbol: ETH
    -   Block Explorer URL: https://explorer.zksync.io/
    -   WebSocket URL: wss://mainnet.era.zksync.io/ws
