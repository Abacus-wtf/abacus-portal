import GlobalLayout from "@layouts/index"
import Legacy from "@sections/Legacy"
import React from "react"

const LegacyV1 = (props: any) => (
  <GlobalLayout {...props}>
    <Legacy legacy={1} />
  </GlobalLayout>
)

export default LegacyV1
