import GlobalLayout from "@layouts/index"
import Legacy from "@sections/Legacy"
import React from "react"

const LegacyV3 = (props: any) => (
  <GlobalLayout {...props}>
    <Legacy legacy={3} />
  </GlobalLayout>
)

export default LegacyV3
