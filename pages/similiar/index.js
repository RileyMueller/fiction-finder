// id stands for embedding_id
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import FictionList from "../../components/FictionList";

const SimilarList = () => {
    const router = useRouter();
    const { id } = router.query;
    const [similiar, setSimiliar] = useState([{embedding_id: 0, title: 'Loading...'}]);

    useEffect(() => {
        getSimiliar(id).then((data) => {
            setSimiliar(data);
        });
    }, [id]);

    return (
        <>
            <div>
                <h1>Results similiar to</h1>
                <FictionList fictions={similiar} />
            </div>
        </>
    );
};

async function getSimiliar(id) {

    const res = await fetch(`/api/search_with_fiction?id=${id}`);

    if (!res) throw new Error("Failed fetch to api/search_with_fiction");
    console.log(res.statusText);

    const data = await res.json();

    if (data.error) {
        console.log(`Error while using /api/search_with_fiction: ${data.error}`);
        return [];
    }

    return data;
}

export default SimilarList;
