/* vercel next.js serverless function that retrieves `fictions` table information from supabase */
import { supabase } from "../../utils/initSupabase";

/**This function should now retrieve the specified number of elements from the fictions table, 
 * starting at the index determined by the page number, and return them in the response.
 */
export default async function handler(req, res) {
    
    const search = req.query.search || ''; // get the search terms or use '' if not provided
    const page = Number(req.query.page) || 1; // get the page number from the query string, or use 0 if not provided
    const elementsPerPage = Number(process.env.ELEMENTS_PER_PAGE); // number of elements to retrieve per page
    const offset = (page-1) * elementsPerPage; // calculate the index to start retrieving elements from

    const { data, error } = await supabase.rpc('search_range', {term: search, start_index: offset, end_index: offset+elementsPerPage-1})

    if (data) {
        try {
            res.status(200).json({fictions: data});    
        }catch(error){
            res.status(400).json({err: error, msg: error?.message, data: data});
        }
    } else {
        res.status(500).json(error);
    }
}

