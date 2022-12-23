import React from "react";
import FictionList from "./FictionList";
import { useState, useEffect } from "react";
import Link from "next/link";

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

    return (
        <div>
            <FictionList fictions={fictions} />
            <div>
                <p>
                    Page {page} of {totalPages}
                </p>
                <button disabled={page === 1}>
                    <Link href={`/?page=${page - 1}`}>Prev</Link>
                </button>

                <button disabled={page >= totalPages}>
                    <Link href={`/?page=${page + 1}`}>Next</Link>
                </button>
            </div>
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
