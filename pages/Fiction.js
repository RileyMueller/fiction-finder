import React from 'react';

const Fiction = (props) => {
  const { title, author, url, onFindSimilar } = props;

  return (
    <div>
      <h3>{title}</h3>
      <p>by {author}</p>
      <a href={url}>Read more</a>
      <button onClick={onFindSimilar}>Find Similar</button>
    </div>
  );
};

export default Fiction;
