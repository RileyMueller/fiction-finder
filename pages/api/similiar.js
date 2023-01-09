import { supabase } from "../../utils/initSupabase";
import { query, fetch, upsert } from "../../utils/pinecone";


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

        embedding_id = 'fiction'+embedding_id;


        // first retrieve the vector for the embedding id we want
        const vector = await fetch(embedding_id, 'fictions');
        
        const json = await query(vector, 'fictions');

        var ids_string = "";

        let matches = json.matches;

        matches.forEach((match)=>{
            const match_id = match.id;
            // match_id are in the format fiction1, fiction2, etc..., need to remove the 'fiction' part
            ids_string += match_id.substring(6) + ",";
        });

        // takes a string of comma seperated ids and returns an array of fictions
        const fictions = await supabase.rpc('fictions_from_ids', {ids: ids_string})

        for (let i = 0; i < fictions.length; i++) {
            fictions[i]['score'] = matches[i].score;
        }

        res.status(200).json(fictions);
    } catch (err) {
        console.log(err.message);
    }
}
