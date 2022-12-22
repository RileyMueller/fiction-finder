import Fiction from "./Fiction";

const FictionList = ({ fictions }) => {
    return (
        <div>
            {fictions.map((fiction) => (
                <Fiction
                    key={fiction.id}
                    title={fiction.title}
                    author={fiction.author}
                    url={fiction.url}
                    embedding_id={fiction.embedding_id}
                />
            ))}
            
        </div>
    );
};

export default FictionList;