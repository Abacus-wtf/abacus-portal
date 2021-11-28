import GlobalLayout from "@layouts/index"
import Home from "@sections/Home"
import Auction from "@sections/Auction"
import React from "react"

const IndexPage = (props: any) => {
  /*return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  )*/

  return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  )
}

export default IndexPage
