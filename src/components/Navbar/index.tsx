import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Row } from "shards-react"
import { useActiveWeb3React, usePrevious } from "@hooks/index"
import { shortenAddress } from "@config/utils"
import { useToggleWalletModal } from "@state/application/hooks"
import { Menu, X } from "react-feather"
import Button, { ButtonClear } from "../Button"
import NetworkSelectorButton from "./NetworkSelectorButton"

const RowStyled = styled(Row)`
  padding: 0px;
  transition: 0.3s;
  margin: 0;
`

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text1};
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
  top: ${({ theme }) => theme.navbar.height};
  background-color: ${({ theme }) => theme.colors.bg1};
  z-index: 1;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
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

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    flex-direction: row;
    grid-gap: 0px;
  }

  @media ${({ theme }) => theme.mediaMin.tablet} {
    grid-gap: 40px;
  }
`

const ListSection = styled(ListSectionSelector)`
  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    width: 100%;
    justify-content: center;
  }
`

const MobileNavButton = styled(ButtonClear)`
  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    display: none;
  }
`

const HeaderLink = styled(ButtonClear)<{ active: string }>`
  min-width: fit-content;
  opacity: 0.4;
  transition: 0.2s;
  font-size: 1rem;

  &:hover {
    opacity: 1;
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
  background-color: ${({ theme }) => theme.colors.bg1};
  height: ${({ theme }) => theme.navbar.height};

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
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
            >
              My Sessions
            </HeaderLink>
            <HeaderLink
              as="a"
              href="/claim-pool"
              active={location.pathname.includes("/claim-pool").toString()}
            >
              Claim & Deposit
            </HeaderLink>
            <HeaderLink
              as="a"
              href="/legacy"
              active={location.pathname.includes("/legacy").toString()}
            >
              Legacy
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
