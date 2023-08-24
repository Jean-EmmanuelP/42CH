import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import ContextWrapper from "~/context/ContextWrapper";
import MainLayout from "~/components/MainLayout";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/B.ico" />
      </Head>
        <ContextWrapper>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ContextWrapper>
    </>
  );
};

export default api.withTRPC(MyApp);
