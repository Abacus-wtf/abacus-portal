import GlobalLayout from "@layouts/index"
import Home from "@sections/Home"
import React from "react"

const IndexPage = (props: any) => (
  /* return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  ) */

  <GlobalLayout {...props}>
    <Home />
  </GlobalLayout>
)

export default IndexPage
