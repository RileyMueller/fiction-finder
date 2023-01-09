import { supabase } from "../../utils/initSupabase";
import { pinecone_query, pinecone_fetch, pinecone_upsert } from "../../utils/pinecone";

async function attempt_get_prompt_id(text) {
    const { data, error } = await supabase
        .from("prompts")
        .select("id")
        .filter("text", "eq", text);
    if (data) {
        if (data.length === 0) {
            return null;
        } else {
            return data[0]["id"];
        }
    } else {
        throw error;
    }
}

/**
 * Uses OpenAI ADA text embedding model to generate a vector for the given text
 * @param {*} text the text to generate a vector for
 */
async function create_vector(text) {

    const body = { model: "text-embedding-ada-002", input: text };

    const body_str = JSON.stringify(body);

    const response = await fetch(
        "https://api.openai.com/v1/embeddings", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Length": body_str.length,
            },
            body: body_str,
        }
    );

    const json = await response.json();

    return json.data[0].embedding;    
}

async function save_prompt(prompt) {
    const { data, error } = await supabase.rpc("save_prompt", {
        prompt_text: prompt,
    });
    if (data) {
        return data;
    } else {
        throw error;
    }
}

export default async function handler(req, res) {
    try {
        let prompt = await req.query.p;

        if (!prompt) {
            res.status(400).json({ error: "No prompt provided" });
            return;
        }

        // attempt to get the prompt id from the database
        let prompt_id = await attempt_get_prompt_id(prompt);
        let vector;
        if (!prompt_id) {
            // save the prompt to the database and get its id
            prompt_id = await save_prompt(prompt);

            // create a vector for the prompt
            vector = await create_vector(prompt, "prompt" + String(prompt_id));

            // save the vector to pinecone
            await pinecone_upsert(vector, "prompt" + String(prompt_id), "prompts");
        } else {
            // retrieve vector from pinecone
            // prompt vector embedding_ids have a 2 tacked on the front
            // fiction vector embedding_ids have a 1 tacked on the front
            vector = await pinecone_fetch("prompt" + String(prompt_id), "prompts");
        }

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
