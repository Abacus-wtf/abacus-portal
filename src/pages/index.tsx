import GlobalLayout from "@layouts/index"
import Home from "@sections/Home"
import React from "react"
import Auction from "@sections/Auction"

const IndexPage = (props: any) => {
  // @TODO: UPDATE AUCTION HERE
  
  return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  )

  return (
    <GlobalLayout {...props}>
      <Home />
    </GlobalLayout>
  )
}

export default IndexPage
