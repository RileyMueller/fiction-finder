import { supabase } from "../../utils/initSupabase";

export default async function handler(req, res) {
    const { count } = supabase
        .from("fictions")
        .select("", { count: "exact" });

    const num_pages = Math.ceil(count / process.env.ELEMENTS_PER_PAGE);
    console.log(`Number of pages: ${num_pages}`);
    res.json({pages: num_pages});
}
