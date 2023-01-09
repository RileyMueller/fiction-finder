import Fiction from "./Fiction";

const FictionList = ({ fictions }) => {
    return (
        <div className="fiction-list">
        <div className="grid">
          {(fictions && fictions.map) && fictions?.map((fiction) => (
            <div key={fiction.embedding_id} className="grid-item">
              <Fiction
                title={fiction.title}
                author={fiction.author}
                url={fiction.url}
                embedding_id={fiction.embedding_id}
                score={fiction.score}
              />
            </div>
          ))}
        </div>
      </div>
      
    );
};

export default FictionList;