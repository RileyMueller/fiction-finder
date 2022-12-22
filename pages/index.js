import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Homepage from "./Homepage";
import Dashboard from "./Dashboard";

const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps(context) {
    const res = await fetch(`/api/total_fictions`);

    if (!res) throw new Error("Failed fetch to api/total_fictions");

    const { pages } = await res.json();

    return {
        props: { totalPages: pages }, // will be passed to the page component as props
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
