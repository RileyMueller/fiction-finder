import Fiction from "./Fiction";

const FictionList = ({ fictions }) => {
    return (
        <ul>
            {fictions?.map((fiction) => (
                <li key={fiction.embedding_id}>
                    <Fiction
                    title={fiction.title}
                    author={fiction.author}
                    url={fiction.url}
                    embedding_id={fiction.embedding_id}
                />
                </li>
            ))}
            
        </ul>
    );
};

export default FictionList;