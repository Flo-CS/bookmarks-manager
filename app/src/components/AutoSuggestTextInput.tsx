import styled from "styled-components";
import { TextInput } from "./TextInput";
import React, { useMemo, useState } from "react";
import { loopNext, loopPrevious } from "../../utils/arrays";
import WithLabel from "./WithLabel";
import { useFuzzySearch } from "../hooks/useFuzzySearch";

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
    const filteredSuggestions = useFuzzySearch<string>(inputValue, suggestions, {}, 5)
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    const keysActions: Record<string, () => void> = useMemo(() => ({
        ArrowDown: () => {
            setSelectedSuggestion(loopNext(filteredSuggestions, selectedSuggestion))
        },
        ArrowUp: () => {
            setSelectedSuggestion(loopPrevious(filteredSuggestions, selectedSuggestion))
        },
        Enter: () => {
            handleSuggestionValidation(selectedSuggestion)
        },
        Escape: () => {
            reset()
        }
    }), [setSelectedSuggestion, handleSuggestionValidation, reset, filteredSuggestions, selectedSuggestion])

    function reset() {
        setSelectedSuggestion(null)
    }

    function handleSuggestionValidation(suggestion: string | null) {
        onSuggestionValidation(suggestion)
        reset()
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        onInputChange(e.target.value)
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (keysActions[e.key]) keysActions[e.key]()
        onInputKeyDown(e.key)
    }

    const hasSuggestions = useMemo(() => inputValue !== "", [filteredSuggestions]);

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
                            onClick={() => handleSuggestionValidation(suggestion)}
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