
/**
 * The Query operation searches a namespace, using a query vector.
 * It retrieves the ids of the most similar items in a namespace, along with their similarity scores. 
 * @param {Array} vector
 * @param {String} namespace 
 * @returns 
 */
export const pinecone_query = async function (vector, namespace) {
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

/**
 * The Upsert operation writes vectors into a namespace.
 * If a new value is upserted for an existing vector id, it will overwrite the previous value.
 * @param {Array} vector 
 * @param {Number} id 
 * @param {String} namespace 
 * @returns 
 */
export const pinecone_upsert = async function (vector, id, namespace) {
    const body = {"vectors":[{id: id, values: vector}], namespace: namespace};

    const body_str = JSON.stringify(body);

    const url = `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/upsert`
     
    await fetch(
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
}

/**
 * The Fetch operation looks up and returns vectors, by ID, from a single namespace.
 * The returned vectors include the vector data and/or metadata.
 */
export const pinecone_fetch = async function (id, namespace) {
    const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/fetch?ids=${id}&namespace=${namespace}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Api-Key": process.env.NEXT_PUBLIC_PINECONE_API_KEY,
            },
        }
    );
    const data = await response.json();
    
    return data['vectors'][id]['values'];
}

