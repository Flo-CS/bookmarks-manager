import { format, startOfMonth } from "date-fns"
import { orderBy } from "lodash"
import { useMemo } from "react"
import { CompleteBookmark, getKeySeparatedBookmarks } from "../helpers/bookmarks"
import BookmarkCard from "./BookmarkCard"
import TitleGridContainer from "./TitleGridContainer"

import noPicture from "./../../assets/no_picture.png"

type Props = {
    bookmarks: CompleteBookmark[],
    onEdit: (id: string) => void,
    onDelete: (id: string) => void,
    onTagRemove: (id: string, tag: string) => void,
}
export default function BookmarksLayout({ bookmarks, onEdit, onDelete, onTagRemove }: Props) {

    const monthSeparatedBookmarks = useMemo(() => {
        const separatedBookmarks = getKeySeparatedBookmarks(bookmarks, (b => startOfMonth(b.modificationDate)))
        return orderBy(separatedBookmarks, ([date, _]) => new Date(date), "desc")
    }, [bookmarks])


    return <>{
        monthSeparatedBookmarks.map(([date, bookmarks]) => {
            const formattedDate = format(new Date(date), "MMMM yyyy")

            return <TitleGridContainer key={formattedDate} title={formattedDate} >
                {bookmarks.map(b => {
                    let picturePath = noPicture;
                    if (b.variant === "icon" && b.faviconPath) {
                        picturePath = b.faviconPath;
                    } else if (b.variant === "preview" && b.previewPath) {
                        picturePath = b.previewPath;
                    }

                    return <BookmarkCard key={b.id}
                        onEdit={() => onEdit(b.id)}
                        onDelete={() => onDelete(b.id)}
                        onTagRemove={tag => onTagRemove(b.id, tag)}
                        datetime={b.modificationDate}
                        description={b.description}
                        picturePath={picturePath}
                        tags={b.tags}
                        title={b.linkTitle}
                        link={b.url}
                        variant={b.variant}
                        id={b.id} />
                })}
            </TitleGridContainer>
        })
    }</>
}