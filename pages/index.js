import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Homepage from "./Homepage";
import Dashboard from "./Dashboard";
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticProps(context) {
    const { data, count } = supabase.from("fictions").select("*", { count: "exact" });

    const num_pages = Math.ceil(count / process.env.ELEMENTS_PER_PAGE);
    console.log(`Number of pages: ${num_pages}`);

    return {
        props: { totalPages: num_pages ? num_pages : 100 }, // will be passed to the page component as props
    };
}

export default function Home({ totalPages }) {
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
                <Homepage totalPages={totalPages} />
            </main>
        </>
    );
}
