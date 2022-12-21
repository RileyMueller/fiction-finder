/* vercel next.js serverless function that retrieves `fictions` table information from supabase */
import { supabase } from "../../utils/initSupabase";

export default async function handler(req, res) {
    const { data, error } = await supabase.from("fictions").select('title, author, url, embedding_id');
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).json(error);
    }
}