import styled from "styled-components"

import { MdAdd } from "react-icons/md"

const Wrapper = styled.div`
display: flex;
align-items: flex-end;
width: 100%;
`

const AddButton = styled.button`
    background-color: ${props => props.theme.colors.accent1};
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;

    & > svg {
        color: white;
        width: 60%;
        height: 60%;
    }
`

type Props = {
    onAdd: () => void
}

export default function TopBar({ onAdd }: Props) {
    function handleAdd() {
        onAdd()
    }

    return <Wrapper>
        <AddButton onClick={handleAdd} >
            <MdAdd />
        </AddButton>
    </Wrapper>
}

TopBar.defaultProps = {
    onAdd: () => { }
}