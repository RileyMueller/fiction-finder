import { createClient } from "@supabase/supabase-js";
import Homepage from "./Homepage";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
    
    return (
        <>
            <Homepage/>
        </>
    );
}
