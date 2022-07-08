import styled from "styled-components";
import { TextInput } from "./TextInput";
import React, { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js"
import { loopNext, loopPrevious } from "../../utils/arrays";
import WithLabel from "./WithLabel";

const Container = styled.div`
  position: relative;
  width: 100%;
`

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: ${props => props.theme.colors.darkGrey};
  display: flex;
  border-radius: 0 0 ${props => props.theme.radius.medium} ${props => props.theme.radius.medium};
  overflow: hidden;
`
const SuggestionsList = styled.ul`
  list-style-type: none;
  width: 100%;
`
const SuggestionItem = styled.li<{ isSelected: boolean }>`
  background-color: ${props => props.isSelected && props.theme.colors.accent1};
  width: 100%;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
`

type Props = {
    suggestions?: string[],
    onInputChange?: (value: string) => void,
    onSuggestionValidation?: (value: string | null) => void,
    onInputKeyDown?: (key: string) => void,
    inputValue?: string,
    id?: string,
}

export function AutoSuggestTextInput({
    suggestions = [],
    onInputChange = () => undefined,
    onSuggestionValidation = () => undefined,
    onInputKeyDown = () => undefined,
    inputValue = "",
    id
}: Props) {
    const fuse = useMemo(() => {
        return new Fuse(suggestions)
    }, [suggestions]);

    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    useEffect(() => {
        const results = fuse.search(inputValue, { limit: 5 })
        setFilteredSuggestions(results.map(val => val.item));
    }, [inputValue]);

    function reset() {
        setSelectedSuggestion(null)
        setFilteredSuggestions([])
    }

    function handleChange(value: string) {
        onInputChange && onInputChange(value)
    }

    function handleSuggestionValidation(value: string | null) {
        onSuggestionValidation && onSuggestionValidation(value)
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleChange(e.target.value)
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const keysActions: Record<string, () => void> = {
            ArrowDown: () => { setSelectedSuggestion(loopNext(filteredSuggestions, selectedSuggestion)) },
            ArrowUp: () => { setSelectedSuggestion(loopPrevious(filteredSuggestions, selectedSuggestion)) },
            Enter: () => {
                handleSuggestionValidation(selectedSuggestion);
                reset()
            },
            Escape: () => { reset() }
        }
        keysActions[e.key]()
        onInputKeyDown(e.key)
    }

    function handleSuggestionClick(suggestion: string) {
        handleSuggestionValidation(suggestion);
        reset()
    }

    const hasSuggestions = useMemo(() => filteredSuggestions.length !== 0, [filteredSuggestions]);

    return <Container>
        <TextInput onChange={handleInputChange}
            value={inputValue}
            id={id}
            onKeyDown={handleInputKeyDown} />
        {hasSuggestions &&
            <SuggestionsContainer data-testid="suggestions">
                <SuggestionsList>
                    {filteredSuggestions.map((suggestion) => {
                        return <SuggestionItem key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            isSelected={selectedSuggestion === suggestion}
                            data-testid={selectedSuggestion === suggestion && "selected-suggestion"}>
                            {suggestion}
                        </SuggestionItem>
                    })}
                </SuggestionsList>
            </SuggestionsContainer>}
    </Container>
}

export default WithLabel(AutoSuggestTextInput)