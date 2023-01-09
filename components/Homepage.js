import React from "react";
import FictionList from "./FictionList";
import { useState, useEffect } from "react";
import PromptSearch from "./PromptSearch";

/**
 * Displays the current page of stored fictions
 * @param {*} props
 * @returns
 */
const Homepage = () => {

    const [fictions, setFictions] = useState([]);

    return (
        <div className="homepage">
            <PromptSearch handler = {setFictions}/>
            {fictions && fictions.length > 0 && <h2>Results</h2>}
            <FictionList fictions={fictions} />
        </div>
    );
};

export default Homepage;
