import GlobalLayout from "@layouts/index"
import CreateSession from "@sections/CreateSession"
import React from "react"

const CreateSessionPage = (props: any) => (
  <GlobalLayout {...props}>
    <CreateSession />
  </GlobalLayout>
)

export default CreateSessionPage
