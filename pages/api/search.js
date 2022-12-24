/* vercel next.js serverless function that searches for fictions based on title or author */
import { supabase } from "../../utils/initSupabase";

/**This function should search for a fiction based on title or author
 */
export default async function handler(req, res) {
    const search_term = req.query.search;
    const page = Number(req.query.page) || 1; // get the page number from the query string, or use 0 if not provided
    
    if (!search_term) {
        res.status(404).json({});
        return;
    }

    const elementsPerPage = Number(process.env.ELEMENTS_PER_PAGE); // number of elements to retrieve per page
    const offset = (page-1) * elementsPerPage; // calculate the index to start retrieving elements from

    const { data, error } = await supabase.from("fictions")
        .select('title, author, url, embedding_id')
        .range(offset, offset+elementsPerPage-1)
        .eq('title', search_term);

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).json(error);
    }
}

