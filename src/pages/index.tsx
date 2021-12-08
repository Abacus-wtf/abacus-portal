import GlobalLayout from "@layouts/index"
import Legacy from "@sections/Legacy"
import React from "react"

const IndexPage = (props: any) => (
  /* return (
    <GlobalLayout {...props}>
      <Auction />
    </GlobalLayout>
  ) */

  <GlobalLayout {...props}>
    <Legacy />
  </GlobalLayout>
)

export default IndexPage
