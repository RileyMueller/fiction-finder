import React from "react";
import Fiction from "./Fiction";
import { useState, useEffect } from "react";

// gets called at build time and lets you pass fetched data to the page's props on pre-render
export async function getStaticProps() {
    // {params}
    console.log('static props here');
    const page = 0;
    // make a request to the fictions serverless function
    const res = await fetch(`/api/fictions?page=${page}`);
    const data = await res.json();

    console.log(`Data: ${JSON.stringify(data)}`);

    // send the data as props to the component
    return { props: { data: JSON.stringify(data) } };
    //end
    /*
    // params will contain the page number if provided in the URL
    //const page = params ? params.page : 0;
    const page = 0;
    // make a request to the fictions serverless function
    const res = await fetch(`api/fictions?page=${page}`);
    const data = await res.json();

    console.log(`Data: ${JSON.stringify(data)}`);

    // send the data as props to the component
    return {
        props: {
            fictions: data,
            page: page,
            totalPages: 100,
            handlePageChange: ()=>{console.log('Change the page.')}
        },
    }; */
}

async function getFictions() {
    const page = 0;
    // make a request to the fictions serverless function
    const res = await fetch(`/api/fictions?page=${page}`);
    const data = await res.json();

    console.log(`Data: ${JSON.stringify(data)}`);

    // send the data as props to the component
    return JSON.stringify(data);
}

const Homepage = (props) => {
    //const { fictions, page, totalPages, handlePageChange } = props;
    const {data} = props;
    const [text, setText] = useState("state text");

    useEffect(() => {
        getFictions().then((data) => {
            setText(data);
        });
    }, []);

    return (
        <div>
            {/* {fictions.map((fiction) => (
        <Fiction
          key={fiction.id}
          title={fiction.title}
          author={fiction.author}
          url={fiction.url}
          onFindSimilar={() => handleFindSimilar(fiction.embeddingId)}
        />
      ))} */}
            <div>{text?.slice(0, 30)}</div>
            <div>
                {data}
                {/* {page > 1 && <button onClick={() => handlePageChange(page - 1)}>Prev</button>}
        {page < totalPages && <button onClick={() => handlePageChange(page + 1)}>Next</button>} */}
            </div>
        </div>
    );
};

export default Homepage;
