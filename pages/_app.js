import "../styles/globals.css";
import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import Head from "next/head";


export default function App({ Component }) {
    const [theme, setTheme] = useState("light"); //default to light mode

    useEffect(()=>{
      document.body.className = theme;  
    }, [theme]);

    function toggleTheme() {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }

    

    return (
        <div>
            <Head>
            <title>Fiction Finder</title>
            <meta
                name="description"
                content="Search for fictions by prompt and similiarity to other fictions"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
            <Dashboard theme={theme} toggleTheme={toggleTheme} />
            <hr className="divider"/>
            <Component/>
        </div>
    );
}
