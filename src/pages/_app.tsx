import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import ContextWrapper from "~/context/ContextWrapper";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";
import Social from "~/components/Social";
import MainLayout from "~/components/MainLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ContextWrapper>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ContextWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
