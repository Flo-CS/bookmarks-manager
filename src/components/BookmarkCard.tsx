import styled from "styled-components";
import Tag from "./Tag";
import {formatDistanceToNow} from "date-fns";

const ICON_HEIGHT = 40;

const Card = styled.article`
  background-color: ${props => props.theme.colors.grey};
  min-height: 120px;
  width: 100%;
  display: inline-flex;
  overflow-y: hidden;
  flex-grow: 1;
  border-radius: ${props => props.theme.radius.medium};
  font-size: ${props => props.theme.fontSizes.medium}rem;
  padding: ${props => props.theme.spacing.medium};
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
  height: ${props => props.isIcon ? `${ICON_HEIGHT}px` : "100%"};
  display: inline-block;
  max-width: 100px;
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

type Props = {
    variant: "preview" | "icon",
    title: string,
    id: string,
    link: string,
    picturePath: string;
    description: string,
    tags: string[],
    datetime: Date
}

export default function BookmarkCard({variant, title, id, link, picturePath, description, tags, datetime}: Props) {
    return <Card>
        {variant === "preview" && <Picture src={picturePath} alt="Preview or website icon picture"/>}
        <CardFlow>
            <CardHead>
                {variant === "icon" && <Picture src={picturePath} alt="Preview or website icon picture" isIcon/>}
                <TitleContainer>
                    <Title>{title}</Title>
                    <Link href={link}>{link}</Link>
                </TitleContainer>
                <DateTime data-testid="datetime"
                          dateTime={datetime.toISOString()}>{formatDistanceToNow(datetime, {addSuffix: true})}</DateTime>
            </CardHead>
            <Description>{description}</Description>
            <TagsContainer>
                {tags.map(tag => {
                    return <Tag size="little" key={tag}>{tag}</Tag>;
                })}
            </TagsContainer>
        </CardFlow>
    </Card>
}