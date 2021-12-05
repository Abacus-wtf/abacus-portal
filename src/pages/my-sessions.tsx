import GlobalLayout from "@layouts/index"
import MySessions from "@sections/MySessions"
import React from "react"

const MySessionsPage = (props: any) => (
  <GlobalLayout {...props}>
    <MySessions />
  </GlobalLayout>
)

export default MySessionsPage
