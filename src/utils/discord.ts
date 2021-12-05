import "whatwg-fetch"

type SendDiscordMessageParams = {
  webhookUrl: string
  message: string
}

export const sendDiscordMessage = async ({
  webhookUrl,
  message,
}: SendDiscordMessageParams) => {
  const reqBody = { content: message }
  try {
    const res = await fetch(webhookUrl, {
      body: JSON.stringify(reqBody),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return res
  } catch (error) {
    // console.log("error", error)
    return error
  }
}
