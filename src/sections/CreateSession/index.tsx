import React, {useState, FormEvent} from 'react';
import {Title, Subheader, UniversalContainer, SubText} from '@components/global.styles'
import { ListGroup, ListGroupItem, Form } from "shards-react";
import {InputWithTitle} from '@components/Input'
import {ButtonsWhite} from '@components/Button'
import { Modal, ModalBody } from "shards-react";
import styled from 'styled-components'

const ListGroupStyled = styled(ListGroup)`
  min-width: 450px;
  margin: 45px 0px;
`

const CreateSession: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [openModal, setOpenModal] = useState(false)

  const toggle = () => setOpenModal(!openModal)

  return (
    <UniversalContainer style={{alignItems: 'center'}}>
      <Modal size='md' open={openModal} toggle={toggle} centered={true}>
        <ModalBody></ModalBody>
      </Modal>
      <div>
        <Title style={{marginBottom: 3}}>Create a Session</Title>
        <Subheader>Create a Pricing Protocol Session</Subheader>
        <Form onSubmit={(e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          console.log(e.target['nftAddress'].value)
          console.log(e.target['tokenId'].value)
          console.log(e.target['initAppraisal'].value)
          toggle()
        }}>
          <ListGroupStyled>
            <ListGroupItem>
              <InputWithTitle 
                title={'NFT address'}
                id={'nftAddress'}
                placeholder="0x2170ed0880ac9a755f"
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle 
                title={'Token ID'}
                id={'tokenId'}
                placeholder='10'
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle 
                title={'Initial Appraisal (ETH)'}
                id={'initAppraisal'}
                placeholder='0.001'
              />
            </ListGroupItem>
          </ListGroupStyled>
          <div style={{display: 'flex', flexDirection: 'column', gridGap: 10}}>
            <ButtonsWhite type="submit" style={{maxWidth: 'fit-content'}} disabled={!isWalletConnected}>
              Start Session
            </ButtonsWhite>
            {!isWalletConnected && <SubText>Connect your wallet first</SubText>}
          </div>
        </Form>
      </div>
    </UniversalContainer>
  )
}

export default CreateSession
