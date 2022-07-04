import {AutoSuggestTextInput} from "./AutoSuggestTextInput";
import WithLabel from "./WithLabel";
import React, {useMemo, useState} from "react";
import styled from "styled-components";
import Tag from "./Tag";
import {last} from "lodash";
import {isValidTag} from "../../utils/tags";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.radius.small};
  width: 100%;
  min-height: 45px;

  padding: 0 ${props => props.theme.spacing.medium};
  padding-top: ${props => props.theme.spacing.small};

  & > * {
    margin-right: ${props => props.theme.spacing.small};
    margin-bottom: ${props => props.theme.spacing.small};
  }

  & > *:last-child, & > *:last-child input {
    max-width: 250px;
    padding: 0;
    height: auto;
  }
`

type Props = {
    tagsSuggestions?: string[],
    tags?: string[],
    onChange?: (allTags: string[], update: string) => void,
    id?: string
}

export function TagsInput({tagsSuggestions = [], tags = [], onChange, id}: Props) {
    const [inputValue, setInputValue] = useState("");
    const tagsSet = useMemo(() => new Set(tags), [tags]);

    function addTag(tagToAdd: string) {
        if (isValidTag(tagToAdd)) {
            const trimmed = tagToAdd.trim()
            tagsSet.add(trimmed)
            onChange && onChange([...tagsSet], trimmed);
            setInputValue("")
        }
    }

    function removeTag(tagToRemove: string) {
        tagsSet.delete(tagToRemove);
        onChange && onChange([...tagsSet], tagToRemove);
    }

    function removeLastTag() {
        const lastTag = last(tags)
        lastTag && removeTag(lastTag)
    }

    function handleInputChange(val: string) {
        setInputValue(val)
    }

    function handleInputKeyDown(key: string) {
        if (key === "Backspace" && inputValue === "") {
            removeLastTag()
        }
    }

    function handleSuggestionValidation(suggestion: string | null) {
        if (suggestion === null) {
            addTag(inputValue)
        } else {
            setInputValue(suggestion)
        }
    }

    function handleTagClose(tag: string) {
        removeTag(tag);
    }

    return <Container>
        {tags.map(tag => {
            return <Tag key={tag} onClose={() => handleTagClose(tag)}>{tag}</Tag>
        })}
        <AutoSuggestTextInput suggestions={tagsSuggestions}
                              inputValue={inputValue}
                              onInputChange={handleInputChange}
                              onSuggestionValidation={handleSuggestionValidation}
                              onInputKeyDown={handleInputKeyDown}
                              id={id}/>
    </Container>
}

export default WithLabel(TagsInput)