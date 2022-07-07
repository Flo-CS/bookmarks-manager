import styled, { css } from "styled-components";
import Tag from "./Tag";
import { formatDistanceToNow } from "date-fns";

import { MdContentCopy, MdDelete, MdEdit } from "react-icons/md";
import useHover from "../hooks/useHover";
import { useRef } from "react";
import { BookmarkVariant } from "../../utils/bookmarks";
import { IdDragItem } from "../../types/dragAndDrop";
import { useDrag } from "react-dnd";
import { Nullable } from "../../types/helpersTypes";
import { DndItems } from "../../utils/dragAndDrop";

const ICON_HEIGHT = 40;

const Card = styled.article<{ isDragging: boolean }>`
  border-radius: ${props => props.theme.radius.medium};
  font-size: ${props => props.theme.fontSizes.medium}rem;
  background-color: ${props => props.theme.colors.darkGrey};
  display: flex;
  overflow: hidden;
  min-height: 120px;
  opacity: ${props => props.isDragging ? 0.3 : 1};
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CardFlow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`

const CardHead = styled.div`
  display: flex;
`

const Picture = styled.img<{ isIcon?: boolean }>`
  margin-right: ${props => props.theme.spacing.medium};
  max-height: ${props => props.isIcon ? `${ICON_HEIGHT}px` : "100px"};
  display: inline-block;
  object-fit: cover;
`

const Title = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium}em;
`

const Link = styled.a`
  font-size: ${props => props.theme.fontSizes.verySmall}em;
  color: ${props => props.theme.colors.whiteAlternative};
`

const Description = styled.p`
  font-size: ${props => props.theme.fontSizes.small}em;
  color: ${props => props.theme.colors.whiteAlternative};
  margin: ${props => props.theme.spacing.medium} 0;
`

const TagsContainer = styled.div`
  & > * {
    margin-right: ${props => props.theme.spacing.small};
    margin-top: ${props => props.theme.spacing.small};
  }
`

const DateTime = styled.time`
  font-size: ${props => props.theme.fontSizes.verySmall}em;
  color: ${props => props.theme.colors.whiteAlternative};
  margin-left: auto;
`
const CardInside = styled.div`
  padding: ${props => props.theme.spacing.medium};
  width: 100%;
  display: inline-flex;
  overflow-y: hidden;
  flex-grow: 1;
  height: 100%;
`

const CardMenu = styled.div<{ isShown: boolean }>`
  background-color: ${props => props.theme.colors.grey};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.small};

  & > button:nth-last-child(n+2) {
    margin-bottom: ${props => props.theme.spacing.medium};
  }

  & > button:last-child {
    margin-top: auto;
  }

  transition: width 0.1s ease-in-out, opacity 0.1s ease-in-out;

  ${props => {
    if (props.isShown) {
      return css`;
        width: 45px;
        opacity: 1;
      `
    }
    return css`
      opacity: 0;
      width: 0;`
  }}
`

const MenuButton = styled.button`
  border: none;
  width: 25px;
  height: 25px;
  background: none;
  cursor: pointer;

  & > svg {
    color: ${props => props.theme.colors.lightGrey};
    width: 100%;
    height: 100%;
    transition: color 0.1s;
  }

  &:hover {
    > svg {
      color: ${props => props.theme.colors.white};
    }
  }
`

type Props = {
  variant: BookmarkVariant,
  id: string,
  link: string,
  title?: Nullable<string>,
  picturePath?: Nullable<string>;
  description?: Nullable<string>,
  tags?: Nullable<string[]>,
  datetime?: Nullable<Date>,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void
  onTagRemove?: (id: string) => void
}

interface DragCollectedProps {
  isDragging: boolean
}

export default function BookmarkCard({
  variant,
  title,
  id,
  link,
  picturePath,
  description,
  tags,
  datetime,
  onEdit,
  onDelete,
  onTagRemove,
}: Props) {
  const ref = useRef(null);
  const isHovered = useHover(ref);
  const [{ isDragging }, drag] = useDrag<IdDragItem, void, DragCollectedProps>({
    type: DndItems.BOOKMARK,
    item: {
      id: id
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging()
      }
    }
  })

  function handleCopyLinkButtonClick() {
    navigator.clipboard.writeText(link);
  }

  function handleDeleteButtonClick() {
    onDelete && onDelete(id);
  }

  function handleEditButtonClick() {
    onEdit && onEdit(id)
  }

  function handleTagCloseButtonClick(tag: string) {
    onTagRemove && onTagRemove(tag)
  }

  const isVariantIcon = variant === BookmarkVariant.ICON;
  const isVariantPreview = variant === BookmarkVariant.PREVIEW;

  return <Card ref={ref} isDragging={isDragging}>
    <CardInside ref={drag}>
      {(isVariantPreview && picturePath) && <Picture src={picturePath} alt="Preview or website icon picture" />}
      <CardFlow>
        <CardHead>
          {(isVariantIcon && picturePath) &&
            <Picture src={picturePath} alt="Preview or website icon picture" isIcon />}
          <TitleContainer>
            <Title>{title}</Title>
            <Link href={link} target="_blank" rel="noopener noreferrer">{link}</Link>
          </TitleContainer>
          {(!isHovered && datetime) && <DateTime data-testid="datetime"
            dateTime={datetime.toISOString()}>{formatDistanceToNow(datetime, { addSuffix: true })}</DateTime>}
        </CardHead>
        <Description>{description}</Description>
        <TagsContainer>
          {tags?.map(tag => {
            return <Tag size="little" key={tag} onClose={() => handleTagCloseButtonClick(tag)}>{tag}</Tag>;
          })}
        </TagsContainer>
      </CardFlow>
    </CardInside>
    <CardMenu data-testid="menu" isShown={isHovered}>
      <MenuButton aria-label="copy" onClick={handleCopyLinkButtonClick}>
        <MdContentCopy />
      </MenuButton>
      <MenuButton aria-label="edit" onClick={handleEditButtonClick}>
        <MdEdit />
      </MenuButton>
      <MenuButton aria-label="delete" onClick={handleDeleteButtonClick}>
        <MdDelete />
      </MenuButton>
    </CardMenu>
  </Card>
}