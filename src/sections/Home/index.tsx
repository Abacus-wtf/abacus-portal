import React, {useState} from 'react';
import styled from 'styled-components'
import {Title, Subheader} from '@components/global.styles'
import BackgroundSource from '../../images/title_bg.png'
import Button, {ButtonsWhite} from '@components/Button'
import SearchBar from '@components/SeachBar'
import Card from '@components/Card'

const BackgroundIMG = styled.img.attrs({
    src: BackgroundSource
})`
    position: absolute;
    transform: rotate(30deg);
    filter: blur(4px);
    opacity: 0.4;
    height: 450px;
    z-index: -1;
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
`

const HeaderBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    grid-gap: 12px;
    max-height: 38px;
`

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const Home: React.FC = () => {
    const [searchValue, setSearchValue] = useState('')
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
            <CardContainer>
            </CardContainer>
        </HomeContainer>
    )
}

export default Home
