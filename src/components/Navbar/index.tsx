import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Row } from "shards-react"
import { useActiveWeb3React, usePrevious } from "@hooks/index"
import { shortenAddress } from "@config/utils"
import {
  useGetCurrentNetwork,
  useToggleWalletModal,
} from "@state/application/hooks"
import { Menu, X } from "react-feather"
import { NetworkSymbolEnum } from "@config/constants"
import { theme } from "@config/theme"
import loadable from "@loadable/component"
import Button, { ButtonClear } from "../Button"

const NetworkSelectorButton = loadable(() => import("./NetworkSelectorButton"))

const RowStyled = styled(Row)`
  padding: 0px;
  transition: 0.3s;
  margin: 0;
`

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${theme.colors.text1};
`

const LinkList = styled.div<{ menuOpen: boolean }>`
  display: ${({ menuOpen }) => (menuOpen ? "flex" : "none")};
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: ${theme.navbar.height};
  background-color: ${theme.colors.bg1};
  z-index: 1;

  @media ${theme.mediaMin.splitCenter} {
    display: flex;
    width: 100%;
    justify-content: space-between;
    grid-gap: 40px;
    flex-direction: row;
    position: unset;
  }
`

const ListSectionSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${theme.mediaMin.splitCenter} {
    flex-direction: row;
    grid-gap: 0px;
  }

  @media ${theme.mediaMin.tablet} {
    grid-gap: 10px;
  }
`

const ListSection = styled(ListSectionSelector)`
  @media ${theme.mediaMin.splitCenter} {
    width: 100%;
    justify-content: center;
  }
`

const MobileNavButton = styled(ButtonClear)`
  @media ${theme.mediaMin.splitCenter} {
    display: none;
  }
`

const HeaderLink = styled(ButtonClear).attrs(({ disabled }) => ({
  ...(disabled ? { href: "#" } : {}),
}))<{ active: string }>`
  min-width: fit-content;
  opacity: 0.4;
  transition: 0.2s;
  font-size: 1rem;
  ${({ disabled }) => (disabled ? "cursor: not-allowed; opacity: 0.2;" : "")}

  &:hover {
    opacity: ${({ disabled }) => (disabled ? "0.2" : "1")};
  }

  ${({ active }) =>
    active === "true" &&
    `
    opacity: 1;
  `}
`

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0px;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #e4e6ee;
  background-color: ${theme.colors.bg1};
  height: ${theme.navbar.height};

  @media ${theme.mediaMin.splitCenter} {
    height: unset;
    grid-gap: 30px;
    padding: 45px 80px;
  }
`

const Navbar = ({ location }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useToggleWalletModal()
  const prevLocation = usePrevious(location)
  const networkSymbol = useGetCurrentNetwork()
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE

  useEffect(() => {
    if (location !== prevLocation) {
      setMenuOpen(false)
    }
  }, [location, prevLocation])

  return (
    <RowStyled>
      <NavbarContainer>
        <Logo href="/">Abacus</Logo>
        <MobileNavButton onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X /> : <Menu />}
        </MobileNavButton>
        <LinkList menuOpen={menuOpen}>
          <ListSection>
            <HeaderLink
              as="a"
              href="/"
              active={(location.pathname === "/").toString()}
            >
              Explore
            </HeaderLink>
            <HeaderLink
              as="a"
              href="/auction"
              active={location.pathname.includes("/auction").toString()}
            >
              Auction
            </HeaderLink>
            <HeaderLink
              as="a"
              href="/my-sessions"
              active={location.pathname.includes("/my-sessions").toString()}
              disabled={isNetworkSymbolNone}
            >
              My Sessions
            </HeaderLink>
            <HeaderLink
              as="a"
              href="/claim-pool"
              active={location.pathname.includes("/claim-pool").toString()}
              disabled={isNetworkSymbolNone}
            >
              Claim & Deposit
            </HeaderLink>
            <HeaderLink
              as="a"
              href="https://legacy.abacus.wtf"
              active={location.pathname.includes("/legacy").toString()}
            >
              Legacy
            </HeaderLink>
            <HeaderLink
              as="a"
              href="https://abcdao.notion.site/Knowledge-Center-903c10f39eb24efb8e55644a992f859b"
              active={location.pathname.includes("/faq").toString()}
            >
              FAQ
            </HeaderLink>
          </ListSection>
          <ListSectionSelector>
            <NetworkSelectorButton />
            <Button onClick={() => toggleWalletModal()}>
              {account ? shortenAddress(account) : "Connect Wallet"}
            </Button>
          </ListSectionSelector>
        </LinkList>
      </NavbarContainer>
    </RowStyled>
  )
}

export default Navbar
