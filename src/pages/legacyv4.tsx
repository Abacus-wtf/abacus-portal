import GlobalLayout from "@layouts/index"
import Legacy from "@sections/Legacy"
import React from "react"

const LegacyV4 = (props: any) => (
  <GlobalLayout {...props}>
    <Legacy legacy={4} />
  </GlobalLayout>
)

export default LegacyV4
