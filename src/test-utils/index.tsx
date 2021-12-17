import React from "react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { render as rtlRender } from "@testing-library/react"
import { Provider } from "react-redux"
import store from "@state/index"

function render(ui, { ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from "@testing-library/react"
// eslint-disable-next-line import/no-extraneous-dependencies
export { default as userEvent } from "@testing-library/user-event"
// override render method
export { render }
