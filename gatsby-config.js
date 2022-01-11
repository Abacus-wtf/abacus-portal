// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require(`path`)

const config = require("./website")

module.exports = {
  siteMetadata: {
    siteUrl: config.siteUrl,
    title: config.siteTitle,
    twitterHandle: config.twitterHandle,
    description: config.siteDescription,
    keywords: [
      "Software Engineer",
      "Musician",
      "JavaScript Training",
      "Learn Music",
    ],
    canonicalUrl: config.siteUrl,
    author: {
      name: config.author,
      minibio: config.minibio,
    },
    organization: {
      name: config.organization,
      url: config.siteUrl,
    },
    social: {
      twitter: config.twitterHandle,
      fbAppID: "",
    },
  },
  pathPrefix: "__PATH_PREFIX__",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-0NEGLJHXHQ"],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: false,
          respectDNT: true,
        },
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Abacus Protocol Portal`,
        display: `minimal-ui`,
        path: `${__dirname}/src/images`,
        icon: `src/images/logo.png`,
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#E85D75`,
        // Disable the loading spinner.
        showSpinner: true,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
