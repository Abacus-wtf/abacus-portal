import React, { useState, useEffect, useRef } from "react"
import {
  Title,
  Subheader,
  UniversalContainer,
  Label,
} from "@components/global.styles"
import Button, { ButtonsWhite } from "@components/Button"
import Card from "@components/Card"
import {
  useGetMultiSessionData,
  useMultiSessionState,
} from "@state/sessionData/hooks"
import _ from "lodash"
import { Link } from "gatsby"
import { PromiseStatus } from "@models/PromiseStatus"
import PaginationButton from "@components/PaginationButton"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { usePrevious } from "@hooks/index"
import FilterModal from "@components/FilterModal"
import {
  BackgroundIMG,
  HeaderBar,
  CardContainer,
  Header,
  HeaderBarContainer,
} from "./Home.styles"

const Home: React.FC = () => {
  const getMultiSessionData = useGetMultiSessionData()
  const isInitializedRef = useRef(false)
  const { multiSessionData, fetchStatus, isLastPage } = useMultiSessionState()
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<string | null>(null)
  const isLoading = fetchStatus === PromiseStatus.Pending
  const networkSymbol = useGetCurrentNetwork()
  const prevNetworkSymbol = usePrevious(networkSymbol)
  const isNewNetwork = networkSymbol !== prevNetworkSymbol

  useEffect(() => {
    if (isNewNetwork) {
      isInitializedRef.current = false
    }

    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      getMultiSessionData(null)
    }
  }, [getMultiSessionData, isNewNetwork])

  return (
    <UniversalContainer>
      <BackgroundIMG />
      <HeaderBar>
        <Header>
          <Title>Highlighted</Title>
          <Subheader>
            Browse {multiSessionData ? multiSessionData.length : "-"} Total
            Sessions
          </Subheader>
        </Header>
        <HeaderBarContainer>
          <ButtonsWhite onClick={() => setFilterOpen(true)}>
            Filter
          </ButtonsWhite>
          <FilterModal
            open={filterOpen}
            toggle={() => setFilterOpen(false)}
            applyFilters={getMultiSessionData}
            setFilters={setFilters}
          />
          <a href='/create-session'>
            <Button
              style={{ display: "flex", alignItems: "center" }}
            >
              Create Session
            </Button>
          </a>
        </HeaderBarContainer>
      </HeaderBar>

      <CardContainer>
        {_.map(multiSessionData, (i) => (
          <a
            href={`/current-session?address=${i.address}&tokenId=${i.tokenId}&nonce=${i.nonce}`}
            key={`${i.address}-${i.tokenId}-${i.nonce}`}
          >
            <Card {...i} />
          </a>
        ))}
      </CardContainer>
      <UniversalContainer style={{ alignItems: "center", marginTop: "10px" }}>
        {!isLoading &&
          multiSessionData.length === 0 &&
          isInitializedRef.current && (
            <Label>No Results! Try changing the filters.</Label>
          )}
        <PaginationButton
          isLastPage={isLastPage}
          isLoading={isLoading}
          getNextPage={() => getMultiSessionData(filters)}
        />
      </UniversalContainer>
      {isLoading && (
        <UniversalContainer style={{ alignItems: "center" }}>
          Loading... {/* TODO: find a loader */}
        </UniversalContainer>
      )}
    </UniversalContainer>
  )
}

export default Home
