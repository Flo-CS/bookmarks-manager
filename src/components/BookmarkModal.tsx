import React, { useContext, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { BookmarkForModal, BookmarkUserComplement } from '../helpers/bookmarks'
import TextInput from './TextInput'
import MultilineTextInput from './MultilineTextInput'
import TagsInput from './TagsInput'
import styled, { css, useTheme } from 'styled-components'
import { IoMdClose, IoMdRefresh } from 'react-icons/io'
import { hexToRgba } from '../helpers/colors'
import { isEqual, pickBy } from 'lodash'
import { TagsContext } from '../App'

const buttonReset = css`
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: ${props => props.theme.colors.white};
`
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

  @media (min-width: ${props => props.theme.deviceSizes.tablet}) {
    flex-direction: row;
  }
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
  ${buttonReset}
  background-color: ${props =>
    props.isImportant
      ? props.theme.colors.accent1
      : props.theme.colors.darkGrey};
  height: 40px;
  width: 120px;
  border-radius: ${props => props.theme.radius.small};
`


type Props = {
  isOpen: boolean
  title?: string
  originalBookmark: BookmarkForModal
  isFetchingData?: boolean
  onClose: () => void
  onFetchBookmarkLink: (url: string) => void
  onBookmarkSave: (data: Partial<BookmarkUserComplement>) => void
}

export default function BookmarkModal({
  isOpen,
  onClose,
  title,
  originalBookmark,
  onFetchBookmarkLink,
  onBookmarkSave,
  isFetchingData,
}: Props) {
  const allTags = useContext(TagsContext)
  const [bookmark, setBookmark] = useState(originalBookmark)

  useEffect(() => {
    if (isEqual(bookmark, originalBookmark)) return
    setBookmark(originalBookmark)
  }, [originalBookmark])

  function handleClose() {
    onClose()
  }

  function getBookmarkModifications(): Partial<BookmarkUserComplement> {
    return pickBy(
      bookmark,
      (value, key) => !isEqual(value, (originalBookmark as any)?.[key])
    )
  }

  function handleSave() {
    const modifications = getBookmarkModifications()

    onBookmarkSave(modifications)
  }

  function handleFetchBookmarkData() {
    const modifications = getBookmarkModifications()

    if (modifications.url && Object.keys(modifications).length === 1) {
      onFetchBookmarkLink(bookmark.url)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setBookmark(b => ({ ...b, [name]: value }))
  }

  function handleTagsChange(tags: string[]) {
    setBookmark(b => ({ ...b, tags: tags }))
  }

  const theme = useTheme()
  const modalStyle = useMemo(() => {
    return {
      overlay: {
        zIndex: 9999,
        backgroundColor: hexToRgba(theme.colors.darkGrey, 0.5),
      },
      content: {
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
        <Title>{title}</Title>
        <CloseButton onClick={handleClose} aria-label="close">
          <IoMdClose />
        </CloseButton>
      </TitleContainer>
      <LinkContainer>
        <IconPicture src={bookmark?.faviconPath} />
        <TextInput
          label="URL"
          onBlur={handleFetchBookmarkData}
          name="url"
          value={bookmark.url}
          onChange={handleInputChange}
        />
        <RefreshButton
          disabled={isFetchingData}
          aria-label="fetch data again"
          onClick={handleFetchBookmarkData}
        >
          <IoMdRefresh />
        </RefreshButton>
      </LinkContainer>
      <Separator />
      <BodyContainer>
        <PreviewPicture src={bookmark?.previewPath} />
        <BasicFieldsContainer>
          <TextInput
            label="Name"
            name="linkTitle"
            onChange={handleInputChange}
            value={bookmark.linkTitle}
          />
          <MultilineTextInput
            label="Description"
            name="description"
            onChange={handleInputChange}
            value={bookmark.description}
          />
          <TagsInput
            label="Tags"
            onChange={handleTagsChange}
            tags={bookmark.tags}
            tagsSuggestions={allTags}
          />
        </BasicFieldsContainer>
      </BodyContainer>
      <BottomButtonsContainer>
        <BottomButton
          onClick={handleClose}
          aria-label="cancel"
          isImportant={false}
        >
          Cancel
        </BottomButton>
        <BottomButton
          onClick={handleSave}
          aria-label="save button"
          isImportant={true}
        >
          Save
        </BottomButton>
      </BottomButtonsContainer>
    </Modal>
  )
}


BookmarkModal.defaultProps = {
  originalBookmark: {
    url: '',
    linkTitle: '',
    description: '',
    tags: [] as string[],
  },
  onClose: () => { },
  onFetchBookmarkLink: () => { },
  onBookmarkSave: () => { },
}