import { supabase } from "../../utils/initSupabase";
import { pinecone_query, pinecone_fetch } from "../../utils/pinecone";

export default async function handler(req, res) {
    try {
        const id = await req.query.id;

        if (id === 'undefined') {
            res.status(400).json({ error: "No id provided" });
            return;
        }


        // The id for the fiction in pinecone is "fiction" + id
        const vector_id = 'fiction'+String(id);

        // Retrieve the vector from pinecone
        const vector = await pinecone_fetch(vector_id, "fictions");

        // query pinecone for similiar fictions
        const json = await pinecone_query(vector, "fictions");

        var ids_string = "";

        let matches = json.matches;

        matches.forEach((match) => {
            const match_id = match.id;
            // match_id are in the format fiction1, fiction2, etc..., need to remove the 'fiction' part
            ids_string += match_id.substring(7) + ",";
        });

        // remove trailing , from ids_string
        ids_string = ids_string.substring(0, ids_string.length - 1);

        // takes a string of comma seperated ids and returns an array of fictions
        const fictions = await supabase.rpc("fictions_from_ids", {
            ids: ids_string,
        });
        
    

        for (let i = 0; i < fictions.data.length; i++) {
            fictions.data[i]["score"] = matches[i].score;
        }

        res.status(200).json(fictions.data);
    } catch (err) {
        console.log(err.message);
        res.send({});
    }
}
