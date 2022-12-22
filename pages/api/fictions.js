/* vercel next.js serverless function that retrieves `fictions` table information from supabase */
import { supabase } from "../../utils/initSupabase";

/**This function should now retrieve the specified number of elements from the fictions table, 
 * starting at the index determined by the page number, and return them in the response.
 */
export default async function handler(req, res) {
    const page = req.query.page || 0; // get the page number from the query string, or use 0 if not provided
    const elementsPerPage = process.env.ELEMENTS_PER_PAGE; // number of elements to retrieve per page
    const offset = page * elementsPerPage; // calculate the index to start retrieving elements from

    const { data, error } = await supabase.from("fictions")
        .select('title, author, url, embedding_id')
        .range(offset, offset+elementsPerPage-1);

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).json(error);
    }
}

