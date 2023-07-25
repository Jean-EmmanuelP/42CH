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
        <div className="flex h-screen flex-col">
          <div className="h-20">
            <Navbar />
          </div>
          <div className="flex flex-grow bg-gray-300/20">
            <div className="w-4/5">
              <Component {...pageProps} />
            </div>
            <div className="w-1/5">
              <DefiRightBar />
            </div>
          </div>
        </div>
      </ContextWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
