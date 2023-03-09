// Importing necessary modules and components
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { web3, contract, sharedMessage } from '../lib/web3'
import Box from '../components/Box'
import PurchaseButton from '../components/PurchaseButton'
import Logo from '../public/logo.svg'
import Social from '../public/logo.svg'

// Defining the default component to be rendered
export default function BlocknyteSale() {
  // Declaring and initializing state variables
  const [accounts, setAccounts] = useState([])
  const [canPurchase, setCanPurchase] = useState(false)
  const [totalSales, setTotalSales] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)

  // // Function to connect the page to the user's wallet
  // const connect = function () {
  //   // Connecting to the user's wallet and setting the accounts state variable
  //   window.ethereum
  //     .request({ method: "eth_requestAccounts" })
  //     .then(setAccounts)
  // }

  // Function to connect the page to the user's wallet
const connect = function () {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install a wallet to use this website.')
    return
  }
  
  // Connecting to the user's wallet and setting the accounts state variable
  window.ethereum
  .request({ method: "eth_requestAccounts" })
  .then(setAccounts)
  .catch(error => {
    if (error.code === 4001) {
      alert("You need to allow access to your account in order to use this feature.");
    } else {
      alert("An error occurred while trying to connect to your wallet.");
    }
  });
}
  // Function to check if the user has access to purchase
  const checkAccess = function () {
    // Checking if the user has access to purchase and setting the hasAccess state variable accordingly
    if (accounts.length > 0) {
      contract.methods.hasAccess().call({ from: accounts[0] })
        .then(setHasAccess)
    } else {
      setHasAccess(false)
    }
  }

  // Function to check if the user can purchase and to get the total number of sales
  const fetchCanPurchase = async function () {
    // Checking if the user can purchase and setting the canPurchase state variable accordingly
    contract.methods.canPurchase().call()
      .then(setCanPurchase)

    // Getting the total number of sales and setting the totalSales state variable
    contract.methods.totalSales().call()
      .then(setTotalSales)
  }

  // Function to handle the purchase of tokens
  const purchase = async function () {
    // Checking if the user is logged in
    if (accounts.length > 0) {
      try {
        // Sending the purchase transaction to the contract with a value of 0.01 ETH
        const transaction = await contract.methods.purchase().send({
          from: accounts[0],
          value: web3.utils.toWei("0.01", "ether")
        })

        // Checking if the user has access and updating the canPurchase state variable and the totalSales state variable
        checkAccess()
        fetchCanPurchase()
      } catch (e) {
        alert(e)
      }
    } else {
      alert("Please log in to your wallet.")
    }
  }

  // Function to handle the download of the purchased tokens
  const download = async function () {
    // Checking if the user is logged in
    if (accounts.length > 0) {
      // Signing the shared message with the user's wallet
      const signature = await web3.eth.personal.sign(sharedMessage, accounts[0])

      try {
        // Sending a request to the download API with the signed message and getting the download URL
        const response = await fetch("/api/download", {
          method: "POST",
          body: JSON.stringify({ "signature": signature })
        })
    
        const json = await response.json()
        console.log('json:', json);


        // Redirecting the user to the download URL
        window.location.href = json.url
      } catch (e) {
        alert("Incorrect download URL.")
      }
    } else {
      alert("Please log in to your wallet.")
    }
  }

  useEffect(() => {
    // set up wallet events and initial connection
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(setAccounts)
  
    window.ethereum
      .on("accountsChanged", setAccounts)
  
  }, [])
  
  useEffect(() => {
    // check access if we change accounts
    checkAccess()
    fetchCanPurchase()
  }, [accounts])
  
  return (
    <main>
      <div className="label">Blocknytes Records</div>
      <Box />
      <header className="App-header">
        <Image src={Logo} className="logo" />
  
        <h1>The debut album from Blocknytes</h1>
        <h2>{totalSales} / 100 sold</h2>
  
        <p>Available in a limited edition, holographic digital format through Blocknytes Group.</p>
        <p>20% of all revenue will go directly to the Electronic Frontier Foundation.</p>
      </header>
  
      <PurchaseButton accounts={accounts} connect={connect} purchase={purchase} canPurchase={canPurchase} hasAccess={hasAccess} download={download} />
  
      <Head>
        <title>Blocknyte – the debut album, available in a limited edition</title>
      </Head>
    </main>
  )
}
  
