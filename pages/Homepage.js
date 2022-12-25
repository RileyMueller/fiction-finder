import React from "react";
import FictionList from "./FictionList";
import { useState, useEffect} from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import TextForm from './TextForm';

/**
 * Displays the current page of stored fictions
 * @param {*} props
 * @returns
 */
const Homepage = () => {

    const router = useRouter();
    const page = router.query.page ? Number(router.query.page) : 1;

    const [fictions, setFictions] = useState([]);
    const [search, setSearch] = useState("");
    const [totalpages, setTotalPages] = useState(1);

    /**
     * By default show the fictions from the top of the fictions table
     * If the page changes,
     */

    useEffect(() => {
        getFictions(page, search).then((data) => {
            setFictions(data);
        });
        getPages(search).then((data)=>{
            setTotalPages(data);
        })        
        
    }, [page, search]); //updates on page or search change

    const Pageination = () => {
        return (
            <div className="pagination">
                <p className="page-info">
                    Page {page} of {totalpages}
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
                    disabled={page >= totalpages}
                    onClick={() => Router.push(`/?page=${page + 1}`)}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="homepage">
            <div className="search-container">
                <TextForm handler={setSearch}/>
                {/* <input type="text" className="search-input" ref={inputRef} />
                <button
                    className="search-button"
                    onClick={() => {
                        if (prevsearch != inputRef.current) {
                            setPrevSearch(inputRef.current);
                            setSearch(inputRef.current); // will proc useEffect
                        }
                    }}
                >
                    Search
                </button> */}
            </div>
            <Pageination />
            <FictionList fictions={fictions} />
        </div>
    );
};

async function getPages(search) {
    const params = new URLSearchParams();
    params.set('search', search);

    const res = await fetch(`api/pages?${params.toString()}`);
    if (!res) throw new Error("Failed fetch to api/pages");

    const data = await res.json();

    // send the data as props to the component
    return data;
}

async function getFictions(page, search) {
    // params will contain the page number if provided in the URL
    if (!page) {
        throw new Error(`getFictions helper needs a page number`);
    }
    // make a request to the fictions serverless function
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('search', search);

    const res = await fetch(`api/fictions?${params.toString()}`);
    if (!res) throw new Error("Failed fetch to api/fictions");

    const data = await res.json();

    // send the data as props to the component
    return data;
}

export default Homepage;
