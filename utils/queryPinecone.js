
export const queryPinecone = async function (vector, namespace) {
    // Content-Length is the length of the body json (every character)
    //const body = {"queries":[{"values":vector}],"topK":6,"includeMetadata":false,"includeValues":false}
    const body = {"vector":vector,"topK":Number(process.env.SIMILIAR_TO_RETURN),"includeMetadata":false,"includeValues":false, "namespace": namespace};

    const body_str = JSON.stringify(body);

    const url = `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/query`
     
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
                "Api-Key": process.env.NEXT_PUBLIC_PINECONE_API_KEY,
                "Content-Length": body_str.length
            },
            body: body_str
        }
    );
    
    return await response.json();
}
