import React from "react"
import Helmet from "react-helmet"

type SchemaOrgProps = {
  author?: string
  canonicalUrl?: string
  defaultTitle: string
  description?: string
  image?: string
  organization?: string
  title: string
  url: string
}

export default React.memo<SchemaOrgProps>(({ defaultTitle, title, url }) => {
  const schema = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url,
      name: title,
      alternateName: defaultTitle,
    },
  ]

  return (
    <Helmet>
      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
})
