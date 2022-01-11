import { useStaticQuery, graphql } from "gatsby"

export const useStaticImage = (fileName: string) => {
  const {
    allFile: { edges },
  } = useStaticQuery<{
    allFile: { edges: { node: { publicURL: string; name: string } }[] }
  }>(graphql`
    {
      allFile {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `)
  return edges.find((edge) => edge.node.name === fileName)
}
