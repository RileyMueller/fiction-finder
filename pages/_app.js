import "../styles/globals.css";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Header from "./Header";

export default function App({ Component, pageProps }) {
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
            <Header />
            <Dashboard theme={theme} toggleTheme={toggleTheme} />
            <hr className="divider"/>
            <Component {...pageProps} />
        </div>
    );
}
