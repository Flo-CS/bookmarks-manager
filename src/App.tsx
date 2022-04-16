import { format } from "date-fns";
import { startOfMonth } from "date-fns/esm";
import { flatten, orderBy, uniq } from "lodash";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { folders as foldersMock } from "../tests/mockData";
import BookmarkCard from "./components/BookmarkCard";
import BookmarkModal from "./components/BookmarkModal";
import FolderName from "./components/FolderName";
import FoldersBreadCrumb from "./components/FoldersBreadCrumb";
import Sidebar from "./components/Sidebar";
import TitleGridContainer from "./components/TitleGridContainer";
import { BookmarkUserComplement, getKeySeparatedBookmarks } from "./helpers/bookmarks";
import { SpecialFolders } from "./helpers/folders";
import useBookmarkModal from "./hooks/useBookmarkModal";
import useBookmarks from "./hooks/useBookmarks";
import useFolders from "./hooks/useFolders";
import { GlobalStyle } from "./styles/GlobalStyle";
import Theme from "./styles/Theme";

const Layout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  height: 100%;
`

const Main = styled.main`
  overflow-y: auto;
  height: 100%;
  padding: ${props => props.theme.spacing.medium};
`

const fakeBookmarks = [{
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "1",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    modificationDate: new Date("2022-02-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "2",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    modificationDate: new Date("2022-12-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "3",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    modificationDate: new Date("2021-01-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "4",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    modificationDate: new Date("2022-01-14T08:00:00")
}]


export const TagsContext = React.createContext<string[]>([]);

// Temporary code, only for the MVP creation process*
export function App() {
    const { foldersRoot, insertFolder, getPathTo } = useFolders(foldersMock, "root")
    const { bookmarks, removeBookmark, modifyBookmark } = useBookmarks(fakeBookmarks);

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useBookmarkModal(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useBookmarkModal(bookmarks);

    const [selectedFolderId, setSelectedFolderId] = useState<string>(SpecialFolders.ALL);

    function handleAddFolder(name: string) {
        insertFolder(selectedFolderId, {
            key: name,
            name: name
        })
    }

    function handleModalBookmarkSave(data: Partial<BookmarkUserComplement>) {
        modifyBookmark(editModalBookmark?.id, data)
        closeEditModal()
    }


    const allTags = useMemo(() => uniq(flatten(bookmarks.map(b => b.tags))), [bookmarks])

    const monthSeparatedBookmarks = useMemo(() => {
        const separatedBookmarks = getKeySeparatedBookmarks(bookmarks, (b => startOfMonth(b.modificationDate)))
        return orderBy(separatedBookmarks, ([date, _]) => new Date(date), "desc")
    }, [bookmarks])

    return (
        <Theme>
            <GlobalStyle />
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar folders={{ main: foldersRoot.children || [] }}
                        onFolderAdd={handleAddFolder}
                        onSelectedFolderChange={(folderId) => setSelectedFolderId(folderId)}
                        selectedFolderId={selectedFolderId} />
                    <Main>
                        <FoldersBreadCrumb >
                            {getPathTo(selectedFolderId).map(folder => {
                                return <FolderName key={folder.key} name={folder.name} icon={folder.icon} />
                            })}
                        </FoldersBreadCrumb>
                        {monthSeparatedBookmarks.map(([date, bookmarks]) => {
                            const formattedDate = format(new Date(date), "MMMM yyyy")

                            return <TitleGridContainer key={formattedDate} title={formattedDate} >
                                {bookmarks.map(b => <BookmarkCard key={b.id}
                                    onEdit={() => openEditModal(b.id)}
                                    onDelete={() => removeBookmark(b.id)}
                                    onTagRemove={(tag => modifyBookmark(b.id, { tags: b.tags.filter(t => t !== tag) }))}
                                    datetime={b.modificationDate}
                                    description={b.description}
                                    picturePath={b.picturePath}
                                    tags={b.tags}
                                    title={b.linkTitle}
                                    link={b.url}
                                    variant={b.variant}
                                    id={b.id} />
                                )}
                            </TitleGridContainer>
                        })
                        }
                    </Main>
                    <BookmarkModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onBookmarkSave={handleModalBookmarkSave}
                        title="Edit bookmark"
                        originalBookmark={editModalBookmark} />
                    <BookmarkModal
                        isOpen={isNewModalOpen}
                        onClose={closeNewModal}
                        title="Add new bookmark"
                        originalBookmark={newModalBookmark} />
                </Layout>
            </TagsContext.Provider>
        </Theme>
    )
}
