import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Title, Subheader} from '@components/global.styles'
import BackgroundSource from '@images/title_bg.png'
import Button, {ButtonsWhite} from '@components/Button'
import SearchBar from '@components/SeachBar'
import Card from '@components/Card'
import {useGetMultiSessionData} from '@state/singleToken/hooks'
import { useSelector } from 'react-redux'
import {AppState} from '@state/index'
import Loader from 'react-loader'
import _ from 'lodash';

const BackgroundIMG = styled.img.attrs({
    src: BackgroundSource
})`
    position: absolute;
    transform: rotate(30deg);
    filter: blur(4px);
    opacity: 0.4;
    height: 450px;
    z-index: -1;
    top: 0;
`

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 0px;
`

const HeaderBar = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 45px;
`

const HeaderBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    grid-gap: 12px;
    max-height: 38px;
`

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    row-gap: 40px;
`

const Home: React.FC = () => {
    const getMultiSessionData = useGetMultiSessionData()
    const multiSessionData = useSelector<AppState, AppState['sessionData']['multiSessionData']>(state => state.sessionData.multiSessionData)
    const [searchValue, setSearchValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (multiSessionData !== null) {
            //setIsLoading(false)
        }
    }, [multiSessionData])

    useEffect(() => {
        getMultiSessionData()
    }, [])

    return (
        <HomeContainer>
            <BackgroundIMG />
            <HeaderBar>
                <div>
                    <Title>Highlighted</Title>
                    <Subheader>Browse 345 Total Sessions</Subheader>
                </div>
                <HeaderBarContainer>
                    <ButtonsWhite>Filter</ButtonsWhite>
                    <SearchBar 
                        input={searchValue} 
                        changeInput={(input) => setSearchValue(input)}
                        placeholder={'Find something'}
                        onEnter={() => {}} />
                    <Button>Create Session</Button>
                </HeaderBarContainer>
            </HeaderBar>
            {isLoading
                ? 
                    <HomeContainer style={{alignItems: 'center'}}>
                        <Loader />
                    </HomeContainer>
                : 
                    <CardContainer>
                        {_.map(multiSessionData, (i) => <Card {...i}/>)}
                    </CardContainer>
            }
        </HomeContainer>
    )
}

export default Home
