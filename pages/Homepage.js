import React from "react";
import FictionList from "./FictionList";
import { useState, useEffect } from "react";
import Router from "next/router";

/**
 * Displays the current page of stored fictions
 * @param {*} props
 * @returns
 */
const Homepage = ({ page, totalPages }) => {
    const [fictions, setFictions] = useState([]);

    useEffect(() => {
        getFictions(page).then((fictions) => {
            if (!fictions) {
                throw new Error("getFictions returned no fictions");
            }
            setFictions(fictions);
        });
    }, [page]); //updates on page change

    const PageDisplay = () => {
        return (
            <div className="pagination">
                    <p className="page-info">
                        Page {page} of {totalPages}
                    </p>
                    <button
                        className="prev-button"
                        disabled={page === 1}
                        onClick={() => Router.push(`/?page=${page - 1}`)}
                    >
                        Prev
                    </button>
                    <button
                        className="next-button"
                        disabled={page >= totalPages}
                        onClick={() => Router.push(`/?page=${page + 1}`)}
                    >
                        Next
                    </button>
                </div>
        )
    }    

    return (
        <div className="homepage">
            <PageDisplay/>
            <FictionList fictions={fictions} />
            <PageDisplay/>
        </div>
    );
};

async function getFictions(page) {
    // params will contain the page number if provided in the URL
    if (!page) {
        throw new Error(`getFictions helper needs a page number`);
    }
    // make a request to the fictions serverless function
    const res = await fetch(`api/fictions?page=${page}`);

    if (!res) throw new Error("Failed fetch to api/fictions");

    const data = await res.json();

    // send the data as props to the component
    return data;
}

export default Homepage;
