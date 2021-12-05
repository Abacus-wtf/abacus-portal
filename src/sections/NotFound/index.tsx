import { Title } from "@components/global.styles"
import * as React from "react"
import { Container } from "./styles"

const NotFound = () => (
  <Container>
    <Title className="four-title">404</Title>
    <Title className="four-not">Not Found</Title>
  </Container>
)

export default NotFound
