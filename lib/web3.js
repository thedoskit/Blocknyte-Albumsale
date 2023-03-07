import Web3 from 'web3';
import BlocknyteSale from './BlocknyteSale.json'

const web3 = new Web3(Web3.givenProvider || "https://old-sparkling-frost.ethereum-goerli.discover.quiknode.pro/3a04aa8b4f02396502a65ab17258727c46e677a6/");

const contractAddress = "0x9dfFf978F0391c4877d486152cD391C175A0a075"
const contract = new web3.eth.Contract(BlocknyteSale.abi, contractAddress)

const sharedMessage = "This is to confirm your account when downloading the limited edition album"

export { web3, contract, contractAddress, sharedMessage }