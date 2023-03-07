import axios from 'axios';
import { web3, contract, sharedMessage } from '../../lib/web3';

export default async function handler(req, res) {
  // make sure the download is only
  // accessible to people who own it

  try {
    // parse the request body
    const body = JSON.parse(req.body)

    // check if the signature is present in the request body
    if (!body.signature) {
      res.status(403).json({ error: 'Signature not found.' });
    }

    // recover the account from the signature using web3
    const account = web3.eth.accounts.recover(sharedMessage, body.signature)

    // check if the account has access to the download using the contract's hasAccess method
    contract.methods.hasAccess().call({ from: account })
      .then(async function (data) {
        console.log('data:', data);
        if (data) {
          const fileUrl = `https://nftstorage.link/ipfs/bafybeigb6qlwbcoal2u6kefy3fsgenshc3235iczn3yycy2tpotcxr5ql4`;

          // use Axios to download the file
          const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'blob', // set the response type to blob to download binary data
          });

          // set the Content-Disposition header to force download the file with a specific name
          if (response && response.data) {
            res.setHeader('Content-Disposition', 'attachment; filename=download.zip');
            res.send(response.data);
          } else {
            res.status(500).json({ error: 'Error downloading file.' });
          }
        } else {
          res.status(403).json({ error: 'Unauthorized access.' });
        }
      })

  } catch (e) {
    console.error('Error:', e);
    // catch any errors and return a 403 response
    res.status(403).json({ error: 'Access denied.' });
  }
}




// import { web3, contract, sharedMessage } from '../../lib/web3';

// // function to return a 403 response if access is not allowed
// const notOk = (res) => {
//   res.status(403).json({ url: null })
// }

// // function to return a 200 response with the download url
// const ok = (res) => {
//   res.status(200).json({ url: "https://nftstorage.link/ipfs/bafybeigb6qlwbcoal2u6kefy3fsgenshc3235iczn3yycy2tpotcxr5ql4/"})
// }
// // const ok = (res) => {
// //   const downloadLink = "https://nftstorage.link/ipfs/bafybeigb6qlwbcoal2u6kefy3fsgenshc3235iczn3yycy2tpotcxr5ql4";
// //   res.status(200).json({ downloadLink });
// // }

// export default async function handler(req, res) {
//   // make sure the download is only
//   // accessible to people who own it

//   try {
//     // parse the request body
//     const body = JSON.parse(req.body)

//     // check if the signature is present in the request body
//     if (!body.signature) {
//       notOk(res)
//     }

//     // recover the account from the signature using web3
//     const account = web3.eth.accounts.recover(sharedMessage, body.signature)

//     // check if the account has access to the download using the contract's hasAccess method
//     contract.methods.hasAccess().call({ from: account })
//       .then(function (data) {
//         console.log('data:', data);
//         if (data) {
//           ok(res)
//         } else {
//           notOk(res)
//         }
        
//       })

//   } catch (e) {
//     console.error('Error:', error);
//     // catch any errors and return a 403 response
//     notOk(res)
//   }
// }
