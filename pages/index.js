import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Homepage from "./Homepage";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getStaticProps(context) {
    const { data, error } = await supabase.rpc("fictions_count");

    if (error) throw new Error(error);

    const num_pages = Math.ceil(data / process.env.ELEMENTS_PER_PAGE);

    return {
        props: { totalPages: num_pages ? num_pages : 100 }, // will be passed to the page component as props
    };
}

export default function Home({ totalPages }) {
    const router = useRouter();
    const page = router.query.page ? Number(router.query.page) : 1;

    return (
        <>
            <Homepage page={page} totalPages={totalPages} />
        </>
    );
}
