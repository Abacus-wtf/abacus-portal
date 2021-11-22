const sizes = {
  tablet: "1200px",
  splitCenter: "885px",
  phone: "600px",
}

export const theme = {
  colors: {
    text1: "#000",
    text2: "#6C7388",
    text3: "#D5D7DF",
    oppositeText1: "#fff",

    bg1: "#fff",
    bg2: "#E4E4E4",

    accent: "#355DFF",
  },
  copy: {
    large: "40px",
  },
  navbar: {
    height: "60px",
  },
  media: {
    splitCenter: `(max-width: ${sizes.splitCenter})`,
    tablet: `(max-width: ${sizes.tablet})`,
    phone: `(max-width: ${sizes.phone})`,
  },
  mediaMin: {
    splitCenter: `(min-width: ${sizes.splitCenter})`,
    tablet: `(min-width: ${sizes.tablet})`,
    phone: `(min-width: ${sizes.phone})`,
  },
}
