import GlobalLayout from "@layouts/index"
import CurrentSession from "@sections/CurrentSession"
import React from "react"

const CurrentSessionPage = (props: any) => {
  const { location } = props
  return (
    <GlobalLayout {...props}>
      <CurrentSession location={location} />
    </GlobalLayout>
  )
}

export default CurrentSessionPage
