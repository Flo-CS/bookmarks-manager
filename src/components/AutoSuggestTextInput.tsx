import styled from "styled-components";
import {TextInput} from "./TextInput";
import React, {useEffect, useMemo, useState} from "react";
import Fuse from "fuse.js"
import WithLabel from "./WithLabel";
import {loopNext, loopPrevious} from "../helpers/arrays";

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
    suggestions: string[],
    onChange?: (value: string) => void,
    value?: string
}

export function AutoSuggestTextInput({suggestions, onChange, value = ""}: Props) {
    const fuse = useMemo(() => {
        return new Fuse(suggestions)
    }, [suggestions]);


    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    useEffect(() => {
        const results = fuse.search(value)
        setFilteredSuggestions(results.map(val => val.item));
    }, [value]);


    function handleChange(val: string) {
        onChange && onChange(val)
    }

    function handleKeyDown(key: string) {
        switch (key) {
            case "ArrowDown":
                setSelectedSuggestion(loopNext(filteredSuggestions, selectedSuggestion))
                break;
            case "ArrowUp":
                setSelectedSuggestion(loopPrevious(filteredSuggestions, selectedSuggestion))
                break;
            case "Enter":
                selectedSuggestion && handleChange(selectedSuggestion);
                setFilteredSuggestions([]) // To close the suggestions list
                break;
            case "Escape":
                setFilteredSuggestions([])
                break;
        }
    }

    function handleSuggestionClick(suggestion: string) {
        setSelectedSuggestion(suggestion);
        handleChange(suggestion);
    }

    return <Container>
        <TextInput isMultiline={false} onChange={onChange} value={value} onKeyDown={handleKeyDown}/>
        {filteredSuggestions.length !== 0 && <SuggestionsContainer data-testid="suggestions">
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