import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function SignIn() {
  async function RedirectTo42() {
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/auth/redirect_fortytwo/"
    );
    console.log(request);
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
        console.log(request);
        console.error(request.data.error);
      }
      console.log(code);
    }
  }

  useEffect(() => {
    fetchData();
  }, [code]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center border border-black">
      <div className="h-[55%] w-[40%] rounded-md bg-white p-2 shadow-md border border-black">
        <div className="h-[30%] flex justify-center items-center border border-black"><h1 className="text-black font-bold text-[25px]">Welcome to 42Ch</h1></div>
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
    </div>
  );
}
