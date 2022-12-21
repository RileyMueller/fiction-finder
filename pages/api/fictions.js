/* vercel next.js serverless function that retrieves `fictions` table information from supabase */
import {supabase} from '../../utils/initSupabase';

export default function handler (req, res) {
    const {query} = req
    const {id} = query
    supabase.from('fictions')
    .select('*')
    .where({id})
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({error})
    })
}