import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Link from "gatsby-link"
import { ChevronsLeft, AlignJustify } from "react-feather"
import { Row } from "shards-react"
import Button, { ButtonClear } from "../Button"
import { useActiveWeb3React } from "@hooks/index"
import { shortenAddress } from "@config/utils"
import { useToggleWalletModal } from "@state/application/hooks"
import NetworkSelectorButton from './NetworkSelectorButton'

const RowStyled = styled(Row)`
  padding: 0px;
  transition: 0.3s;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text1};
`

const activeClassName = "ACTIVE"

const LinkList = styled.div`
  display: flex;
  grid-gap: 40px;
  align-items: center;
`

const HeaderLink = styled(ButtonClear)<{active: string}>`
  min-width: fit-content;
  opacity: 0.4;
  transition: 0.2s;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }

  ${({active}) => active === 'true' && `
    opacity: 1;
  `}
`

const NavbarContainer = styled.div`
  display: flex;
  grid-gap: 30px;
  padding: 45px 80px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #e4e6ee;
  background-color: ${({ theme }) => theme.colors.bg1};
`

const Navbar = ({location}) => {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useToggleWalletModal()

  // @TODO: UPDATE AUCTION HERE

  return (
    <RowStyled>
      <NavbarContainer>
        <Logo to="/">Abacus</Logo>
        <LinkList>
          {/*<HeaderLink as={Link} to="/" active={(location.pathname === '/').toString()}>
            Explore
          </HeaderLink>*/}
          <HeaderLink as={Link} to="/" active={(location.pathname === '/').toString()}>
            Auction
          </HeaderLink>
          {/*<HeaderLink as={Link} to="/claim-pool" active={(location.pathname === '/claim-pool').toString()}>
            Claim Pool
          </HeaderLink>*/}
          {/*<HeaderLink as={Link} to="/my-sessions" active={(location.pathname === '/my-sessions').toString()>
            My Sessions
          </HeaderLink>
          */}
        </LinkList>
        <LinkList>
          <NetworkSelectorButton />
          <Button onClick={() => toggleWalletModal()}>
            {account ? shortenAddress(account) : "Connect Wallet"}
          </Button>
        </LinkList>
      </NavbarContainer>
    </RowStyled>
  )
}

export default Navbar
