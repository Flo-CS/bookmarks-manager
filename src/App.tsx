import {flatten, uniq} from "lodash";
import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {folders as foldersMock} from "../tests/mockData";
import BookmarkModal from "./components/BookmarkModal";
import BookmarksLayout from "./components/BookmarksLayout";
import FolderName from "./components/FolderName";
import FoldersBreadCrumb from "./components/FoldersBreadCrumb";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import {BookmarkAPI, ElectronBookmarkAPI} from "./helpers/api";
import {
    BookmarkForDatabase,
    BookmarkUserComplement,
    CompleteBookmark,
    createDefaultBookmark
} from "./helpers/bookmarks";
import {SpecialFolders} from "./helpers/folders";
import useBookmarkModal from "./hooks/useBookmarkModal";
import useBookmarks from "./hooks/useBookmarks";
import useFolders from "./hooks/useFolders";
import {GlobalStyle} from "./styles/GlobalStyle";
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

export const TagsContext = React.createContext<string[]>([]);

const bookmarkApi: BookmarkAPI = new ElectronBookmarkAPI();

// Temporary code, only for the MVP creation process*
export function App() {
    const {foldersRoot, insertFolder, getPathTo} = useFolders(foldersMock, "root")
    const [selectedFolderId, setSelectedFolderId] = useState<string>(SpecialFolders.ALL);
    const {
        bookmarks,
        selectedBookmarks,
        removeBookmark,
        updateBookmark,
        getBookmark,
        addBookmark,
        setBookmarks
    } = useBookmarks<CompleteBookmark>([], selectedFolderId);

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useBookmarkModal<BookmarkForDatabase>(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useBookmarkModal<BookmarkForDatabase>();

    useEffect(() => {
        async function fetchBookmarks() {
            const bookmarks = await bookmarkApi.getBookmarks()
            setBookmarks(bookmarks)
        }

        fetchBookmarks()
    }, [])


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
        const newBookmark = createDefaultBookmark(selectedFolderId);
        openNewModal(newBookmark);
    }

    function handleBookmarkEdit(id: string) {
        openEditModal(id)
    }

    function handleEditModalSave(data: Partial<BookmarkUserComplement>) {
        if (editModalBookmark) {
            bookmarkApi.updateBookmark(editModalBookmark.id, data).then((newBookmark) => {
                updateBookmark(editModalBookmark.id, newBookmark)
            })
            closeEditModal()
        }
    }

    function handleNewModalSave(data: Partial<BookmarkUserComplement>) {
        if (newModalBookmark) {
            const newBookmark = {...newModalBookmark, ...data}
            bookmarkApi.addBookmark(newBookmark).then((bookmark) => {
                addBookmark(bookmark)
                closeNewModal()
            })
        }
    }

    function handleBookmarkTagRemove(id: string, tag: string) {
        const bookmark = getBookmark(id);
        if (bookmark) {
            const newTags = bookmark.tags.filter(t => t !== tag);
            bookmarkApi.updateBookmark(bookmark.id, {tags: newTags}).then((newBookmark) => {
                updateBookmark(bookmark.id, newBookmark)
            })
        }
    }

    function handleBookmarkDelete(id: string) {
        bookmarkApi.removeBookmark(id).then(() => {
            removeBookmark(id)
        })
    }

    const allTags = useMemo(() => uniq(flatten(bookmarks.map(b => b.tags))), [bookmarks])
    const selectedFolderPath = useMemo(() => getPathTo(selectedFolderId), [selectedFolderId])

    return (
        <Theme>
            <GlobalStyle/>
            <TagsContext.Provider value={allTags}>
                <Layout className="app">
                    <Sidebar folders={{main: foldersRoot.children || []}}
                             onFolderAdd={handleAddFolder}
                             onSelectedFolderChange={handleFolderSelection}
                             selectedFolderId={selectedFolderId}/>
                    <Main>
                        <TopBar onAdd={handleBookmarkCreation}/>
                        <FoldersBreadCrumb>
                            {selectedFolderPath.map(folder => {
                                return <FolderName key={folder.key} name={folder.name} icon={folder.icon}/>
                            })}
                        </FoldersBreadCrumb>
                        <BookmarksLayout bookmarks={selectedBookmarks} onTagRemove={handleBookmarkTagRemove}
                                         onDelete={handleBookmarkDelete} onEdit={handleBookmarkEdit}/>
                    </Main>
                    <BookmarkModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onBookmarkSave={handleEditModalSave}
                        title="Edit bookmark"
                        originalBookmark={editModalBookmark}/>
                    <BookmarkModal
                        isOpen={isNewModalOpen}
                        onClose={closeNewModal}
                        onBookmarkSave={handleNewModalSave}
                        title="Add new bookmark"
                        originalBookmark={newModalBookmark}/>
                </Layout>
            </TagsContext.Provider>
        </Theme>
    )
}
