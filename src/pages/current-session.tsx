import GlobalLayout from "@layouts/index"
import CurrentSession from "@sections/CurrentSession"
import React from "react"

const CurrentSessionPage = (props: any) => {
  return (
    <GlobalLayout {...props}>
      <CurrentSession location={props.location} />
    </GlobalLayout>
  )
}

export default CurrentSessionPage
