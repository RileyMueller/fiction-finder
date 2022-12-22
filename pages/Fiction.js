import React from 'react';
import Link from 'next/link';

const Fiction = (props) => {
  const { title, author, url, embedding_id } = props;

  return (
    <div>
      <h3>{title}</h3>
      <p>by {author}</p>
      <a href={url}>Read more</a>
      <Link href={{
        pathname: `/similiar/${encodeURIComponent(title)}`,
        query: {id: embedding_id}
      }}>Find Similar</Link>
    </div>
  );
};

export default Fiction;
