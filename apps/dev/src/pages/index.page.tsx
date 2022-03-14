import { Button } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hello World</title>
      </Head>
      <Image src="/logo.svg" width={176} height={18.38} />
      <h1>Hello World</h1>
      <Button size="large">Join</Button>
    </>
  );
};

export default Home;
