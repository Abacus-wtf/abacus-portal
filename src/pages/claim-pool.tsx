import GlobalLayout from "@layouts/index"
import ClaimPool from "@sections/ClaimPool"
import React from "react"

const ClaimPoolPage = (props: any) => (
  <GlobalLayout {...props}>
    <ClaimPool />
  </GlobalLayout>
)

export default ClaimPoolPage
