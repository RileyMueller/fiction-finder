import React from 'react';

const About = () => {
  return (
    <div>
      <h2>About</h2>
      <p>
        This website is a platform for discovering new fiction. You can browse through a variety of fictions and find ones that interest you.
      </p>
      <h3>How to use</h3>
      <p>
        To use this website, simply click on a fiction to be redirected to where to read it. You can use the buttons at the bottom of the page to navigate between different pages of fictions. You can also use the &quot;Find Similar&quot; button on each fiction to find similar fictions that you might enjoy.
      </p>
      <h3>How it works</h3>
      <p>
        This website uses a recommendation algorithm to find similar fictions based on the embedding vectors of each fiction. The embedding vectors are calculated using OpenAI&apos;s Ada text embedder on a sample of the fiction.
      </p>
    </div>
  );
};

export default About;
