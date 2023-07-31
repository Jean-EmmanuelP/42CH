import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import ContextWrapper from "~/context/ContextWrapper";
import Navbar from "~/components/Navbar";
import DefiRightBar from "~/components/Defi";
import Social from "~/components/Social";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ContextWrapper>
        <div className="h-full w-screen bg-[#EEF0F3]">
          <div className="mb-[3vh] h-[10vh] w-full">
            <Navbar />
          </div>
          <div className="mx-[1vw] mb-[2vh] flex h-[85vh] w-[98vw] border border-red-500">
            <div className="h-full w-[15vw]  border border-black">
              <Social />
            </div>
            <div className="mx-[2vw] h-full w-[58vw] border border-black">
              <Component {...pageProps} />
            </div>
            <div className="h-full w-[27vw] border border-black rounded-md">
              <DefiRightBar />
            </div>
          </div>
        </div>
      </ContextWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
