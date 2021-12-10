/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FunctionComponent } from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

import config from "../../../website"
import SchemaOrg from "./SchemaOrg"
import defaultMetaImage from "../../images/metaImage.png"

export type SEOWithQueryProps = {
  pageData?: {
    title?: string
    description?: string
    slug?: string
  }
  metaImage?: string
  title?: string
  description?: string
}

interface SEOProps extends SEOWithQueryProps {
  siteMetadata: {
    title: string
    description: string
    canonicalUrl: string
    author: {
      name: string
    }
    organization: {
      name: string
      url: string
    }
    social: {
      twitter: string
      fbAppID?: string
    }
  }
}

const SEO: FunctionComponent<SEOProps> = ({
  siteMetadata: seo,
  pageData = {},
  metaImage,
  title = pageData.title || config.siteTitle,
  description = pageData.description || seo.description,
}) => {
  const image =
    "https://app.abacus.wtf/static/twitter_card-e604e5de62a699aaac0b319c13c71f08.png" // `${seo.canonicalUrl}${metaImage || defaultMetaImage}`
  const url = pageData.slug
    ? `${seo.canonicalUrl}${pageData.slug}`
    : seo.canonicalUrl
  return (
    <>
      <Helmet>
        {/* General tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="image" content={image} />

        {/* OpenGraph tags */}
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        {seo.social.fbAppID && (
          <meta property="fb:app_id" content={seo.social.fbAppID} />
        )}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={seo.social.twitter} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <SchemaOrg
        url={url}
        title={title}
        image={image}
        description={description}
        canonicalUrl={seo.canonicalUrl}
        defaultTitle={seo.title}
      />
    </>
  )
}

const SEOWithQuery: FunctionComponent<SEOWithQueryProps> = ({ ...props }) => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<{
    site: { siteMetadata: SEOProps["siteMetadata"] }
  }>(graphql`
    {
      site {
        siteMetadata {
          title
          description
          canonicalUrl
          author {
            name
          }
          organization {
            name
            url
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  return <SEO siteMetadata={siteMetadata} {...props} />
}

export default SEOWithQuery
