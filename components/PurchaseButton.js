const PurchaseButton = function ({ accounts, connect, purchase, canPurchase, hasAccess, download }) {
  let button = (<button onClick={connect}>Connect wallet to buy</button>)

  if (accounts.length > 0) {
    if (hasAccess) {
      button = (<button onClick={download}>Download</button>)
    } else if (canPurchase) {
      button = (<button onClick={purchase}>Purchase for 0.01 ETH</button>)
    } else {
      button = (<button disabled>Sold out</button>)
    }
  }

  return (
    <footer>{button}</footer>
  )
}

export default PurchaseButton