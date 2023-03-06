import Web3 from 'web3';
import BlocknyteSale from './BlocknyteSale.json'

const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:7545");

const contractAddress = "0x9dfFf978F0391c4877d486152cD391C175A0a075"
const contract = new web3.eth.Contract(BlocknyteSale.abi, contractAddress)

const sharedMessage = "This is to confirm your account when downloading the limited edition album"

export { web3, contract, contractAddress, sharedMessage }