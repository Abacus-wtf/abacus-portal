import GlobalLayout from "@layouts/index"
import Legacy from "@sections/Legacy"
import React from "react"

const LegacyPage = (props: any) => (
  <GlobalLayout {...props}>
    <Legacy legacy={5} />
  </GlobalLayout>
)

export default LegacyPage
