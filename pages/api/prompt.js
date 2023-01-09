import { supabase } from "../../utils/initSupabase";
import { queryPinecone } from "../../utils/queryPinecone";
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

async function attempt_get_prompt_id(text) {
    const { data, error } = await supabase.from('prompts')
        .select('id')
        .filter('text', 'eq', text);
    if (data) {
        return data[0]['id'];
    } else {
        throw error;
    }
}

/**
 * Saves the prompt to supabase db and returns the id of the new row
 * 
 * The table in supabase is called prompts, and has the following columns:
 * id, created_at, text
 * only text is needed to insert a new prompt, all other columns automatically generated
 * @param {String} text the text of the prompt 
 */
async function save_prompt(text) {
    const { data, error } = await supabase.from('prompts')
        .insert({ text });
    if (data) {
        return data[0]['id'];
    } else {
        throw error;
    }
}

async function fetch_vector(embedding_id) {
    const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/fetch?ids=${id}&namespace=prompts'`,
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
    
    return data['vectors'][embedding_id.toString()]['values'];
}

async function join_fictions(embedding_id){
    const { data, error } = await supabase.from("fictions")
        .select('title, author, url, embedding_id')
        .filter('embedding_id', 'eq', embedding_id);
    if (data) {
        return data;
    } else {
        throw error;
    }
}

/**
 * Uses OpenAI ADA text embedding model to generate a vector for the given text
 * @param {*} text the text to generate a vector for 
 */
async function create_vector(text) {
    const response = await openai.embeddings.embed({
        model: "ada",
        query: text,
    });
    return response.data;
}

/**
 * Saves the vector to pinecone in the prompt namespace using the given id
 * @param {Array} vector 
 * @param {Number} new_embedding_id 
 */
async function save_vector(vector, new_embedding_id) {
    const body = {"vectors":[{id: new_embedding_id, values: vector}], namespace: "prompts"};

    const body_str = JSON.stringify(body);

    const url = `https://${process.env.NEXT_PUBLIC_PINECONE_INDEX}-${process.env.NEXT_PUBLIC_PINECONE_PROJECT}.svc.${process.env.NEXT_PUBLIC_PINECONE_ENV}.pinecone.io/vectors/upsert`
     
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
    //If response is not 200, throw error
    if (!response.ok) {
        throw new Error(response.statusText);
    }
}


export default async function handler(req, res) {
    try {
        let {text} = await req.query;

        if (!text) {
            res.status(400).json({error: 'No text provided'});
            return;
        }

        // Check to see if the text is already in the database
        let prompt_id = await attempt_get_prompt_id(text);

        let vector;

        if (prompt_id) {
            const embedding_id = Number('2'+String(prompt_id));
            // If it is, retrieve the vector for it from pinecone
            vector = await fetch_vector(embedding_id);
        } else {
            // Insert prompt into database, and get its embedding id
            // embedding ids are automatically generated on creation in the db
            // the embedding id will be used to when inserting into the generated vector into pinecone
            vector = await create_vector(text);
            prompt_id = await save_prompt(text);
            
            const embedding_id = Number('2'+String(prompt_id));
            // Insert the vector into pinecone
            await save_vector(vector, embedding_id);

        }

        // Now query pinecone for similar prompts
        const json = await queryPinecone(vector, "prompts");

        var ids_string = "(";

        json.matches.forEach((match) => {
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