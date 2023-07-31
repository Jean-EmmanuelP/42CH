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
        <div className="h-full w-screen">
          <div className="h-[20vh] mb-[6vh] w-full">
            <Navbar />
          </div>
          <div className="flex h-[72vh] mb-[2vh] mx-[1vw] w-[98vw] border border-red-500">
            <div className="w-[15vw] h-full  border border-black">
              <Social />
            </div>
            <div className="w-[58vw] mx-[2vw] h-full border border-black">
              <Component {...pageProps} />
            </div>
              <div className="w-[27vw] h-full  border border-black">
                <DefiRightBar />
              </div>
          </div>
        </div>
      </ContextWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
