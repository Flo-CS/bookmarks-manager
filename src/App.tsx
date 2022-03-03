import React, {useState} from "react";
import {GlobalStyle} from "./styles/GlobalStyle";
import Theme from "./styles/Theme";
import BookmarkCard from "./components/BookmarkCard";
import TitleGridContainer from "./components/TitleGridContainer";
import Sidebar from "./components/Sidebar";
import {folders as foldersMock} from "../tests/mockData";
import {SpecialFolders} from "./helpers/folders";
import styled from "styled-components";
import useFolders from "./hooks/useFolders";

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

// Temporary code, only for the MVP creation process
export function App() {
    const {foldersRoot, insertFolder} = useFolders(foldersMock, "root")
    const props = {
        variant: "preview" as const,
        title: "This is a title",
        id: "e6c1b24d-f999-4fa9-b204-54713e735c84",
        link: "https://google.com",
        picturePath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
        description: "Google, moteur de recherche",
        tags: ["tag1", "tag2"],
        datetime: new Date("2022-02-14T08:00:00")
    }

    const [selectedFolderId, setSelectedFolderId] = useState<string>(SpecialFolders.ALL);

    return (<Theme>
        <GlobalStyle/>
        <Layout className="app">
            <Sidebar folders={{main: foldersRoot.children || []}}
                     onFolderAdd={(name) => insertFolder(selectedFolderId, {
                         key: name,
                         name: name
                     })}
                     onSelectedFolderChange={(folderId) => setSelectedFolderId(folderId)}
                     selectedFolderId={selectedFolderId}/>
            <Main>
                <TitleGridContainer title="December 2021">
                    <BookmarkCard {...props}/>
                    <BookmarkCard {...props}/>
                    <BookmarkCard {...props}/>
                </TitleGridContainer>
                <TitleGridContainer title="January 2022">
                    <BookmarkCard {...props}/>
                    <BookmarkCard {...props}/>
                    <BookmarkCard {...props}/>
                </TitleGridContainer>
            </Main>
        </Layout>

    </Theme>)
}