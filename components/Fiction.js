import React from "react";
import Link from "next/link";
import Router from "next/router";

const Fiction = (props) => {
    const { title, author, url, embedding_id, score } = props;    

    return (
        <div className="fiction">
            <h3 className="fiction-title">
                <a href={url} className="fiction-link">
                    {title}
                </a>
            </h3>
            <p className="author">by {author}</p>
            {score && <p className="score">Score: {(Number(score) * 100).toFixed(2)}</p>}
            <button
                className="similar-button"
                onClick={() => Router.push(`/similiar?id=${embedding_id}`)}
              >
                Find Similar
              </button>
        </div>
    );
};

export default Fiction;
