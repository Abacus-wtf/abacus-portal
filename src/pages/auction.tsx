import GlobalLayout from "@layouts/index"
import Auction from "@sections/Auction"
import React from "react"

const AuctionPage = (props: any) => {
  return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  )
}

export default AuctionPage
