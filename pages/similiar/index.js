// id stands for embedding_id
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Fiction from "../Fiction";
import Header from "../Header";
import Dashboard from "../Dashboard";

const SimilarList = () => {
    const router = useRouter();
    const { id } = router.query;
    const [similiar, setSimiliar] = useState([]);

    useEffect(() => {
        getSimiliar(id).then((data) => {
            setSimiliar(data);
        });
    }, [id]);


    return (
        <>
        <Header/>
        <main className={styles.main}>
            <Dashboard />
            <ul>
            {similiar?.map((fiction) => (
                <li key={fiction.embedding_id}>
                    <Fiction
                        title={fiction.title}
                        author={fiction.author}
                        url={fiction.url}
                        score={(Number(fiction.score) * 100).toFixed(2)}
                    />
                </li>
            ))}
        </ul>
        </main>
    </>
    );
};

async function getSimiliar(embedding_id) {
    //console.log(embedding_id);
    const res = await fetch(`/api/search?embedding_id=${embedding_id}`);

    if (!res) throw new Error("Failed fetch to api/fictions");
    console.log(res.statusText);
    
    const data = await res.json();

    if (data.error) {
        console.log(`Error while using /api/search: ${data.error}`);
        return [];
    }

    return data;
}

export default SimilarList;
