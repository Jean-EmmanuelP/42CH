import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import ContextWrapper from "~/context/ContextWrapper";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ContextWrapper>
        <Navbar />
        <div className="h-full flex flex-row max-h-screen overflow-auto bg-gray-300/20">
          <div className="h-full w-4/5 overflow-auto">
            <Component {...pageProps} />
          </div>
          <DefiRightBar />
        </div>
      </ContextWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
