import { supabase } from "../../utils/initSupabase";

async function fetch_vector(id) {
    const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/fetch?ids=${id}`,
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
    
    return data['vectors'][id.toString()]['values'];
}

async function query_pinecone(vector) {
    // Content-Length is the length of the body json (every character)
    //const body = {"queries":[{"values":vector}],"topK":6,"includeMetadata":false,"includeValues":false}
    const body = {"vector":vector,"topK":Number(process.env.SIMILIAR_TO_RETURN),"includeMetadata":false,"includeValues":false};

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

async function join_fictions(embedding_id){
    const { data, error } = await supabase.from("fictions")
        .select('title, author, url, embedding_id')
        .filter('embedding_id', 'in', embedding_id);
    if (data) {
        return data;
    } else {
        throw error;
    }
}

export default async function handler(req, res) {
    try {
        let {embedding_id} = await req.query;

        if (embedding_id === 'undefined'){
            res.status(200).json({});
            return;
        }

        if (!embedding_id && embedding_id != 0){
            console.log('invalid embedding_id');
            embedding_id = 0;
        }


        // first retrieve the vector for the embedding id we want
        const vector = await fetch_vector(embedding_id);
        
        const json = await query_pinecone(vector);

        var ids_string = "(";

        // The first element is the vector we searches on, so remove it.
        let matches = json.matches;
        if (json.matches[0].score >= 1)
            matches = matches.slice(1);
        else
            matches = matches.slice(0,-1)

        matches.forEach((match)=>{
            ids_string += match.id + ",";
        });

        ids_string = ids_string.slice(0, -1) + ")";
    
        const joined = await join_fictions(ids_string);

        for (let i = 0; i < joined.length; i++) {
            joined[i]['score'] = matches[i].score;
        }

        res.status(200).json(joined);

    } catch (err) {
        console.log(err.message);
    }
}
