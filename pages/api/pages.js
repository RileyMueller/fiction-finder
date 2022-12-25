/* vercel next.js serverless function that retrieves the number of pages the search on fictions */
import { supabase } from "../../utils/initSupabase";

export default async function handler(req, res) {
    
    const search = req.query.search || ''; // get the search terms or use '' if not provided
    const elementsPerPage = Number(process.env.ELEMENTS_PER_PAGE); // number of elements to retrieve per page
    
    const { data, error } = await supabase.rpc('search_count', {term: search});

    if (data) {
        try {
            res.status(200).json({pages: Math.ceil(data / elementsPerPage)});    
        }catch(error){
            res.status(400).json({err: error, msg: error?.message, data: data});
        }
    } else {
        res.status(500).json(error);
    }
}

