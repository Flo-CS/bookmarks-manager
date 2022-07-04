import React, {useContext, useEffect, useMemo, useState} from 'react'
import Modal from 'react-modal'
import TextInput from './TextInput'
import MultilineTextInput from './MultilineTextInput'
import TagsInput from './TagsInput'
import styled, {css, useTheme} from 'styled-components'
import {IoMdClose, IoMdRefresh} from 'react-icons/io'
import {hexToRgba} from '../../utils/colors'
import {TagsContext} from '../App'
import {buttonReset} from "../styles/utils";
import useObjectModifications from "../hooks/useObjectModifications";
import {AtMost, Nullable} from "../../types/helpersTypes";

const iconButton = css`
  width: 25px;
  height: 25px;

  > svg {
    width: 100%;
    height: 100%;
    color: ${props => props.theme.colors.white};
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.big};
`

const Title = styled.h4`
  font-size: ${props => props.theme.fontSizes.big}rem;
  font-weight: 400;
`
const CloseButton = styled.button`
  ${buttonReset};
  ${iconButton};
`
const RefreshButton = styled.button`
  ${buttonReset};
  ${iconButton};
`
const LinkContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const IconPicture = styled.img`
  width: 40px;
  margin-right: ${props => props.theme.spacing.big};
  border-radius: ${props => props.theme.radius.small};
`
const Separator = styled.hr`
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.accent1};
  margin: ${props => props.theme.spacing.big} 0;
`
const BodyContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

const PreviewPicture = styled.img`
  width: 200px;
  height: 100%;
  border-radius: ${props => props.theme.radius.medium};
  margin-right: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.medium};
  display: ${props => (props.src ? 'block' : 'none')};
`

const BasicFieldsContainer = styled.div`
  width: 100%;

  & > * {
    margin-bottom: ${props => props.theme.spacing.medium};
  }
`

const BottomButtonsContainer = styled.div`
  margin-top: ${props => props.theme.spacing.big};
  display: flex;
  justify-content: space-between;
`

const BottomButton = styled.button<{ isImportant: boolean }>`
  ${buttonReset};
  background-color: ${props =>
          props.isImportant
                  ? props.theme.colors.accent1
                  : props.theme.colors.darkGrey};
  height: 40px;
  width: 120px;
  border-radius: ${props => props.theme.radius.small};
`

interface InitialModalBookmark {
    url: string,
    description?: Nullable<string>,
    tags?: Nullable<string[]>,
    linkTitle?: Nullable<string>,
    faviconPath?: Nullable<string>,
    previewPath?: Nullable<string>
}

type SavedModalBookmark = AtMost<InitialModalBookmark, "faviconPath" | "previewPath">

interface ModalFetchedWebsiteMetadata {
    linkTitle?: Nullable<string>,
    description?: Nullable<string>,
    faviconPath?: Nullable<string>,
    previewPath?: Nullable<string>
}

type Props<T extends InitialModalBookmark> = {
    isOpen: boolean
    modalTitle?: string
    initialBookmark?: T
    onClose: () => void
    fetchWebsiteMetadata: (url: string, forceDataRefresh: boolean) => Promise<ModalFetchedWebsiteMetadata>
    onBookmarkSave: (data: T | undefined) => void
}

const defaultBookmark = {
    url: "",
    linkTitle: "",
    description: "",
    tags: [],
    faviconPath: "",
    previewPath: "",
}

BookmarkModal.defaultProps = {
    onClose: () => undefined,
    fetchWebsiteMetadata: () => ({}),
    onBookmarkSave: () => undefined
}

export default function BookmarkModal<T extends InitialModalBookmark>({
                                                                          isOpen,
                                                                          onClose,
                                                                          modalTitle,
                                                                          initialBookmark,
                                                                          fetchWebsiteMetadata,
                                                                          onBookmarkSave,
                                                                      }: Props<T>) {
    const allTags = useContext(TagsContext)

    const [bookmarkFields, updateBookmarkFields, updateBookmarkField, getBookmarkFieldsModifications] = useObjectModifications<SavedModalBookmark>(defaultBookmark)
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        updateBookmarkFields({
            ...defaultBookmark,
            ...initialBookmark
        })
    }, [initialBookmark])

    function handleClose() {
        onClose()
    }

    function handleSave() {
        if (!initialBookmark) {
            return onBookmarkSave(undefined)
        }
        onBookmarkSave({...initialBookmark, ...bookmarkFields})
    }

    async function handleAutomaticFetchWebsiteMetadata() {
        const modifications = getBookmarkFieldsModifications()

        if (modifications.url) {
            await handleFetchWebsiteMetadata(false, (value) => value === "",)
        }
    }

    async function handleManualFetchWebsiteMetadata() {
        await handleFetchWebsiteMetadata(true)
    }

    async function handleFetchWebsiteMetadata(forceDataRefresh: boolean, eraseIf?: (value: unknown, key: string) => boolean,) {
        setIsFetching(true)
        const websiteMetadata = await fetchWebsiteMetadata(bookmarkFields.url, forceDataRefresh)
        updateBookmarkFields(websiteMetadata, eraseIf)
        setIsFetching(false)
    }

    function handleInputChange({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) {
        updateBookmarkField(name as keyof SavedModalBookmark, value)
    }

    function handleTagsChange(tags: string[]) {
        updateBookmarkField("tags", tags)
    }

    const theme = useTheme()
    const modalStyle = useMemo(() => {
        return {
            overlay: {
                zIndex: 9999,
                backgroundColor: hexToRgba(theme.colors.darkGrey, 0.5),
            },
            content: {
                overflow: 'none',
                width: '100%',
                maxWidth: '700px',
                border: 'none',
                backgroundColor: theme.colors.black,
                inset: '50% auto auto 50%',
                transform: 'translate(-50%, -50%)',
            },
        }
    }, [theme])

    return (
        <Modal
            isOpen={isOpen}
            appElement={document.body}
            shouldCloseOnOverlayClick={true}
            onRequestClose={handleClose}
            shouldCloseOnEsc={true}
            style={modalStyle}
            ariaHideApp={false}
        >
            <TitleContainer>
                <Title>{modalTitle}</Title>
                <CloseButton onClick={handleClose} aria-label="close">
                    <IoMdClose/>
                </CloseButton>
            </TitleContainer>
            <LinkContainer>
                {bookmarkFields.faviconPath && <IconPicture src={bookmarkFields.faviconPath}/>}
                <TextInput
                    label="URL"
                    onBlur={handleAutomaticFetchWebsiteMetadata}
                    name="url"
                    value={bookmarkFields.url}
                    onChange={handleInputChange}
                />
                <RefreshButton
                    aria-label="fetch data again"
                    onClick={handleManualFetchWebsiteMetadata}
                >
                    <IoMdRefresh/>
                </RefreshButton>
            </LinkContainer>
            <Separator/>
            <BodyContainer>
                {bookmarkFields.previewPath && <PreviewPicture src={bookmarkFields.previewPath}/>}
                <BasicFieldsContainer>
                    <TextInput
                        label="Name"
                        name="linkTitle"
                        onChange={handleInputChange}
                        value={bookmarkFields.linkTitle}
                    />
                    <MultilineTextInput
                        label="Description"
                        name="description"
                        onChange={handleInputChange}
                        value={bookmarkFields.description}
                    />
                    <TagsInput
                        label="Tags"
                        onChange={handleTagsChange}
                        tags={bookmarkFields.tags || []}
                        tagsSuggestions={allTags}
                    />
                </BasicFieldsContainer>
            </BodyContainer>
            <BottomButtonsContainer>
                <BottomButton
                    onClick={handleClose}
                    aria-label="cancel"
                    isImportant={false}
                >Cancel</BottomButton>
                <BottomButton
                    onClick={handleSave}
                    aria-label="save button"
                    isImportant={true}
                >Save</BottomButton>
            </BottomButtonsContainer>
        </Modal>
    )
}

