import Head from "next/head";

const Header = () => {
    return (
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
    );
};

export default Header;
