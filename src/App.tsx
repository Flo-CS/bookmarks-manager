import React, { useState } from "react";
import { GlobalStyle } from "./styles/GlobalStyle";
import Theme from "./styles/Theme";
import BookmarkCard from "./components/BookmarkCard";
import TitleGridContainer from "./components/TitleGridContainer";
import Sidebar from "./components/Sidebar";
import { folders as foldersMock } from "../tests/mockData";
import { SpecialFolders } from "./helpers/folders";
import styled from "styled-components";
import useFolders from "./hooks/useFolders";
import BookmarkModal from "./components/BookmarkModal";
import useBookmarkModal from "./hooks/useBookmarkModal";
import useBookmarks from "./hooks/useBookmarks";
import { flatten, uniq } from "lodash";

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
    datetime: new Date("2022-02-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "2",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    datetime: new Date("2022-02-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "3",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    datetime: new Date("2022-02-14T08:00:00")
}, {
    variant: "preview" as const,
    linkTitle: "This is a title",
    id: "4",
    url: "https://google.com",
    picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description: "Google, moteur de recherche",
    tags: ["tag1", "tag2"],
    datetime: new Date("2022-02-14T08:00:00")
}]


export const TagsContext = React.createContext<string[]>([]);

// Temporary code, only for the MVP creation process*
export function App() {
    const { foldersRoot, insertFolder } = useFolders(foldersMock, "root")
    const { bookmarks, removeBookmark, modifyBookmark } = useBookmarks(fakeBookmarks);

    const [isEditModalOpen, editModalBookmark, openEditModal, closeEditModal] = useBookmarkModal(bookmarks);
    const [isNewModalOpen, newModalBookmark, openNewModal, closeNewModal] = useBookmarkModal(bookmarks);

    const [selectedFolderId, setSelectedFolderId] = useState<string>(SpecialFolders.ALL);

    return (
        <Theme>
            <GlobalStyle />
            <TagsContext.Provider value={uniq(flatten(bookmarks.map(b => b.tags)))}>
                <Layout className="app">
                    <Sidebar folders={{ main: foldersRoot.children || [] }}
                        onFolderAdd={(name) => insertFolder(selectedFolderId, {
                            key: name,
                            name: name
                        })}
                        onSelectedFolderChange={(folderId) => setSelectedFolderId(folderId)}
                        selectedFolderId={selectedFolderId} />
                    <Main>
                        <TitleGridContainer title="Some bookmarks" >
                            {bookmarks.map(b => <BookmarkCard key={b.id}
                                onEdit={() => openEditModal(b.id)}
                                onDelete={() => removeBookmark(b.id)}
                                onTagRemove={((tag) => modifyBookmark(b.id, { tags: b.tags.filter(t => t !== tag) }))}
                                datetime={b.datetime}
                                description={b.description}
                                picturePath={b.picturePath}
                                tags={b.tags}
                                title={b.linkTitle}
                                link={b.url}
                                variant={b.variant}
                                id={b.id} />
                            )}
                        </TitleGridContainer>
                    </Main>
                    <BookmarkModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onBookmarkSave={data => {
                            modifyBookmark(editModalBookmark?.id, data)
                            closeEditModal()
                        }}
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