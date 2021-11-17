import GlobalLayout from "@layouts/index"
import Home from "@sections/Home"
import React from "react"

const IndexPage = (props: any) => (
  <GlobalLayout {...props}>
    <Home />
  </GlobalLayout>
)

export default IndexPage
