import styled from "styled-components";
import Tag from "./Tag";
import {formatDistanceToNow} from "date-fns";

const Container = styled.article``

const Head = styled.div``

const Picture = styled.img``

const Title = styled.h3``

const Link = styled.a``

const Description = styled.p``

const TagsContainer = styled.div``

const DateTime = styled.time``

type Props = {
    variant: string,
    title: string,
    id: string,
    link: string,
    picturePath: string;
    description: string,
    tags: string[],
    datetime: Date
}

export default function BookmarkCard({variant, title, id, link, picturePath, description, tags, datetime}: Props) {
    return <Container>
        <Picture src={picturePath} alt="Preview or website icon picture"/>
        <Head>
            <Title>{title}</Title>
            <Link href={link}>{link}</Link>
            <DateTime data-testid="datetime" dateTime={datetime.toISOString()}>{formatDistanceToNow(datetime, {addSuffix: true})}</DateTime>
        </Head>
        <Description>{description}</Description>
        <TagsContainer>
            {tags.map(tag => {
                return <Tag key={tag}>{tag}</Tag>;
            })}
        </TagsContainer>
    </Container>
}