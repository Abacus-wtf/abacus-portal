"use strict"

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require(`path`)

module.exports = {
  siteMetadata: {
    title: `Abacus Protocol Portal`,
    description: `NFT Valuation Tool`,
    author: {
      name: "Abacus Team",
    },
  },
  pathPrefix: "__PATH_PREFIX__",
  plugins: [
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
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-lodash`,
    {
      resolve: `gatsby-plugin-swarm`,
      options: {
        prefix: `__PATH_PREFIX__`,
        pattern: /^(\/bzz:\/[^/]+)/, // use /^(\/(?:ipfs|ipns)\/[^/]+)/ for IPFS
      },
    },
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
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
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
  ],
}
