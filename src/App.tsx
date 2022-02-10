import React from "react";
import Tag from "./components/Tag"
import {GlobalStyle} from "./styles/GlobalStyle";
import Theme from "./styles/Theme";

export function App() {
    return (<Theme>
        <GlobalStyle/>
        <div className="app">
            <Tag onClose={() =>console.log("close")} onClick={()=> console.log("click")} color="accent1">Hello</Tag>
        </div>
    </Theme>)
}