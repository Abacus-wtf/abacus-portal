import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

type PageProps = {
  serverData: {
    dogImage: { message: string }
  }
}
const Page = ({ serverData }: PageProps) => {
  const { dogImage } = serverData
  // Use dogImage in your page...
  console.log(serverData)
  return (
    <div>
      <p>Hello</p>
      <StaticImage src={dogImage.message} alt="Happy Dog" />
    </div>
  )
}

export async function getServerData() {
  const res = await fetch(`https://dog.ceo/api/breeds/image/random`)
  const data = await res.json()
  return {
    props: {
      dogImage: data,
    },
  }
}
export default Page
