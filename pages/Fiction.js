import React from 'react';
import Link from 'next/link';

const Fiction = (props) => {
  const { title, author, url, embedding_id, score } = props;

  return (
    <div>
      <h3><a href={url}>{title}</a></h3>
      <p>by {author}</p>
      {score && <p>Score: {score}</p>}
      {!score && <Link href={`/similiar?id=${embedding_id}`}>Find Similar</Link>}
    </div>
  );
};

export default Fiction;
