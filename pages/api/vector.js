/* retrieves a vector from pinecone */
export default function handler(req, res) {
    const id = req.body && req.body.id ? req.body.id : 0;
    fetch(
        `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}.${NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/fetch?ids=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": process.env.PINECONE_API_KEY,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
}
