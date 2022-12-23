import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Homepage from "./Homepage";
import Dashboard from "./Dashboard";
import {createClient} from '@supabase/supabase-js';
import { useRouter } from "next/router";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticProps(context) {
    const { data, error } = await supabase.rpc('fictions_count');

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
            <Head>
                <title>Fiction Finder</title>
                <meta
                    name="description"
                    content="Search for fictions by prompt or similiarity to other fictions"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Dashboard />
                <Homepage page={page} totalPages={totalPages} />
            </main>
        </>
    );
}
