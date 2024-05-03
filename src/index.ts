import Web3 from 'web3'
import { Web3Adapter } from '@safe-global/protocol-kit'
import SafeApiKit  from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import {MetaTransactionData, OperationType} from '@safe-global/safe-core-sdk-types'
import Config from './config'

async function main(){
  const provider = new Web3.providers.HttpProvider(Config.RPC_URL)
const web3 = new Web3(provider)

const account = web3.eth.accounts.privateKeyToAccount(Config.PRIVAT_KEY)

const ethAdapter = new Web3Adapter({
  web3,
  signerAddress: Config.ETH_ADDRESS
})

//Set the chainID for your network
const apiKit = new SafeApiKit({
    chainId: 11155111n
})

// Create Safe instance
const protocolKit = await Safe.create({
    ethAdapter,
    safeAddress: Config.SAFE_ADDRESS
  })
   
  // Create transaction
  const safeTransactionData: MetaTransactionData = {
    to: Config.SAFE_ADDRESS,
    value: '1', // 1 wei
    data: '0x',
    operation: OperationType.Call
  }
   
  const safeTransaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] })
   
  //const senderAddress = await signer.getAddress()
  const safeTxHash = await protocolKit.getTransactionHash(safeTransaction)
  const signature = await protocolKit.signHash(safeTxHash)
   
  // Propose transaction to the service
 const result = await apiKit.proposeTransaction({
    safeAddress: await protocolKit.getAddress(),
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: account.address,
    senderSignature: signature.data
  })
}

main()