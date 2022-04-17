import { flatten, uniq } from "lodash";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { folders as foldersMock } from "../tests/mockData";
import BookmarkModal from "./components/BookmarkModal";
import BookmarksLayout from "./components/BookmarksLayout";
import FolderName from "./components/FolderName";
import FoldersBreadCrumb from "./components/FoldersBreadCrumb";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { BookmarkUserComplement, CompleteBookmark, createDefaultBookmark } from "./helpers/bookmarks";
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

const fakeBookmarks: CompleteBookmark[] = [{
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "1",
    url: "https://google.com",
    previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    collection: SpecialFolders.WITHOUT_FOLDER,
    modificationDate: new Date("2022-02-14T08:00:00"),
    creationDate: new Date("2022-02-14T08:00:00"),
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "2",
    url: "https://google.com",
    previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    collection: SpecialFolders.WITHOUT_FOLDER,
    modificationDate: new Date("2022-12-14T08:00:00"),
    creationDate: new Date("2022-12-14T08:00:00"),
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "3",
    url: "https://google.com",
    previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    collection: SpecialFolders.WITHOUT_FOLDER,
    modificationDate: new Date("2021-01-14T08:00:00"),
    creationDate: new Date("2021-01-14T08:00:00"),
}, {
    variant: "icon" as const,
    linkTitle: "This is a title",
    id: "4",
    url: "https://google.com",

    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    collection: SpecialFolders.WITHOUT_FOLDER,
    modificationDate: new Date("2022-01-14T08:00:00"),
    creationDate: new Date("2022-01-14T08:00:00"),
}]


export const TagsContext = React.createContext<string[]>([]);

// Temporary code, only for the MVP creation process*
export function App() {
    const { foldersRoot, insertFolder, getPathTo } = useFolders(foldersMock, "root")
    const [selectedFolderId, setSelectedFolderId] = useState<string>(SpecialFolders.ALL);
    const { bookmarks, selectedBookmarks, removeBookmark, updateBookmark, getBookmark, addBookmark } = useBookmarks(fakeBookmarks, selectedFolderId);

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useBookmarkModal<CompleteBookmark>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useBookmarkModal<CompleteBookmark>();


    function handleAddFolder(name: string) {
        insertFolder(selectedFolderId, {
            key: name,
            name: name
        })
    }

    function handleFolderSelection(folderId: string) {
        setSelectedFolderId(folderId)
    }

    function handleBookmarkCreation() {
        const newBookmark = createDefaultBookmark();
        openNewModal(newBookmark);
    }

    function handleBookmarkEdit(id: string) {
        openEditModal(id)
    }

    function handleEditModalSave(data: Partial<BookmarkUserComplement>) {
        if (editModalBookmark) {
            updateBookmark(editModalBookmark.id, data)
            closeEditModal()
        }
    }

    function handleNewModalSave(data: Partial<BookmarkUserComplement>) {
        if (newModalBookmark) {
            addBookmark({ ...newModalBookmark, ...data })
            closeNewModal()
        }
    }

    function handleBookmarkTagRemove(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (bookmark) {
            updateBookmark(bookmark.id, { tags: bookmark.tags.filter(t => t !== tag) })
        }
    }

    function handleBookmarkDelete(id: string) {
        removeBookmark(id)
    }

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(b => b.tags))), [bookmarks])
    const selectedFolderPath = useMemo(() => getPathTo(selectedFolderId), [selectedFolderId])

    return (
        <Theme>
            <GlobalStyle />
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar folders={{ main: foldersRoot.children || [] }}
                        onFolderAdd={handleAddFolder}
                        onSelectedFolderChange={handleFolderSelection}
                        selectedFolderId={selectedFolderId} />
                    <Main>
                        <TopBar onAdd={handleBookmarkCreation} />
                        <FoldersBreadCrumb >
                            {selectedFolderPath.map(folder => {
                                return <FolderName key={folder.key} name={folder.name} icon={folder.icon} />
                            })}
                        </FoldersBreadCrumb>
                        <BookmarksLayout bookmarks={selectedBookmarks} onTagRemove={handleBookmarkTagRemove} onDelete={handleBookmarkDelete} onEdit={handleBookmarkEdit} />
                    </Main>
                    <BookmarkModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onBookmarkSave={handleEditModalSave}
                        title="Edit bookmark"
                        originalBookmark={editModalBookmark} />
                    <BookmarkModal
                        isOpen={isNewModalOpen}
                        onClose={closeNewModal}
                        onBookmarkSave={handleNewModalSave}
                        title="Add new bookmark"
                        originalBookmark={newModalBookmark} />
                </Layout>
            </TagsContext.Provider>
        </Theme>
    )
}
