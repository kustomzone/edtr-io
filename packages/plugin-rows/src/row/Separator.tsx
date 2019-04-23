import React from 'react'
import { Icon, faPlus, styled } from '@edtr-io/ui'

const StyledSeparator = styled.div((isFirst: boolean) => {
  return {
    position: 'absolute',
    height: 'auto',
    width: '100%',
    transform: `${isFirst ? 'translateY(-100%)' : 'translateY(100%)'}`,
    top: `${isFirst ? 0 : undefined}`,
    bottom: `${isFirst ? undefined : 0}`
  }
})

const AddTrigger = styled.div((inline: boolean) => {
  return {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    border: '2px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: inline ? 0.6 : 0,
    transition: '250ms all ease-in-out',
    position: inline ? 'absolute' : 'relative',
    zIndex: 999,
    right: inline ? '15px' : undefined,
    top: inline ? '10%' : undefined,
    transform: inline ? 'translate(-50%)' : undefined,

    '&:hover': {
      opacity: '1 !important',
      cursor: 'pointer'
    }
  }
})

const TriggerArea = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',

  '&:hover .add-trigger': {
    opacity: 0.6
  }
})

export const Add = (onClick: () => void, inline: boolean) => {
  return (
    <AddTrigger inline={inline} className="add-trigger" onClick={onClick}>
      <Icon style={{ width: 14, height: 14 }} icon={faPlus} />
    </AddTrigger>
  )
}

const Separator = (isFirst: boolean, onClick: () => void) => {
  return (
    <StyledSeparator isFirst={isFirst}>
      <TriggerArea>
        <Add onClick={onClick} />
      </TriggerArea>
    </StyledSeparator>
  )
}

export default Separator
