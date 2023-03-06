import { web3, contract, sharedMessage } from '../../lib/web3';

// function to return a 403 response if access is not allowed
const notOk = (res) => {
  res.status(403).json({ url: null })
}

// function to return a 200 response with the download url
// const ok = (res) => {
//   res.status(200).json({ url: `https://nftstorage.link/ipfs/${process.env.REACT_APP_CID}/download`})
// }
const ok = (res) => {
  const downloadLink = `https://nftstorage.link/ipfs/bafybeigb6qlwbcoal2u6kefy3fsgenshc3235iczn3yycy2tpotcxr5ql4/download`;
  res.status(200).json({ downloadLink });
}

export default async function handler(req, res) {
  // make sure the download is only
  // accessible to people who own it

  try {
    // parse the request body
    const body = JSON.parse(req.body)

    // check if the signature is present in the request body
    if (!body.signature) {
      notOk(res)
    }

    // recover the account from the signature using web3
    const account = web3.eth.accounts.recover(sharedMessage, body.signature)

    // check if the account has access to the download using the contract's hasAccess method
    contract.methods.hasAccess().call({ from: account })
      .then(function (data) {
        if (data) {
          ok(res)
        } else {
          notOk(res)
        }
      })

  } catch (e) {
    // catch any errors and return a 403 response
    notOk(res)
  }
}
