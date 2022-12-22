import React from "react";
import Fiction from "./Fiction";

async function getList(){
    if (!embedding_id && embedding_id != 0)
        throw new Error("handleFindSimiliar helper needs an embedding_id");
    const res = await fetch(`api/search?embedding_id=${embedding_id}`);

    if (!res) throw new Error("Failed fetch to api/fictions");

    const data = await res.json();
}


const SimilarList = ({ similiar }) => {
    return (
        <div>
            {similiar.map((fiction) => (
                <Fiction
                    key={fiction.id}
                    title={fiction.title}
                    author={fiction.author}
                    url={fiction.url}
                    score={(fiction.score * 100).toFixed(2)}
                />
            ))}
        </div>
    );
};

export default SimilarList;
