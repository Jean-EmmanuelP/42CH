import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getConfig from "next/config";
import Marquee from "react-fast-marquee";
import { useMediaQuery } from "react-responsive";
const { publicRuntimeConfig } = getConfig();

export default function SignIn() {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  async function RedirectTo42() {
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/auth/redirect_fortytwo/"
    );
    window.location.href = request.data;
  }
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  async function fetchData() {
    if (code !== null) {
      const request = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/signin",
        JSON.stringify({ code: code }),
        { headers: { "Content-Type": "application/json" } }
      );
      if (request.data.success === true) {
        sessionStorage.setItem("username", request.data.username);
        sessionStorage.setItem("accessToken", request.data.access_token);
        window.location.reload();
      } else {
        console.error(request.data.error);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [code]);

  if (isMobile && sessionStorage.getItem("username") === "undefined") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="h-[50%] w-[50%] rounded-md bg-white p-2 shadow-md">
          <div className="h-[20%] flex justify-center items-center"><h1 className="text-black font-bold text-[18px]">Welcome to 42Ch</h1></div>
          <div className="h-[80%] flex flex-col items-center w-full text-[12px]">
            <p className="text-center">
              Participe aux Evenements, Defi les membres de 42Ch
            </p>
            <br />
            <p className="text-center">
              et tente de devenir le meilleur challenger de 42 !
            </p>
            <button
              className="rounded-md border border-white bg-[#F20000] hover:bg-[#F20000]/80 hover:shadow-lg w-[30%] h-[20%] mt-9 text-white shadow-md"
              onClick={() => RedirectTo42()}
            >
              Sign in with 42
            </button>
          </div>
        </div>
        <div className="h-[20%] w-full font-bold text-[40px] text-roboto flex">
          <Marquee speed={90}>
            <p className="pr-[25px]">Teste la Beta</p>
          </Marquee>
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="w-full h-[10%]"></div>
      <div className="h-[60%] w-[40%] rounded-md bg-white p-2 shadow-md">
        <div className="h-[30%] flex justify-center items-center"><h1 className="text-black font-bold text-[25px]">Welcome to 42Ch</h1></div>
        <div className="h-[70%] flex gap-1 flex-col items-center w-full">
          <p className="text-center">
            Participe aux Evenements, Defi les membres de 42Ch
          </p>
          <br />
          <p className="text-center">
            et tente de devenir le meilleur challenger de 42 !
          </p>
          <button
            className="rounded-md border border-white bg-[#F20000] hover:bg-[#F20000]/80 hover:shadow-lg w-[30%] h-[20%] mt-9 text-white shadow-md"
            onClick={() => RedirectTo42()}
          >
            Sign in with 42
          </button>
        </div>
      </div>
      <div className="w-full h-[10%]"></div>
      <div className="h-[20%] w-full font-bold text-[40px] text-roboto flex">
        <Marquee speed={90}>
          <p className="pr-[25px]">BETA, THE FIRST VERSION WILL COME SOON...</p>
        </Marquee>
      </div>
    </div>
  );
}
