import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { redirect } from 'next/navigation'


export default function SignIn() {
  async function RedirectTo42() {
    const request = await axios.get(
      process.env.NEXT_PUBLIC_API_URL+"/auth/redirect_fortytwo/"
    );
    console.log(request);
    window.location.href = request.data;
  }
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  async function fetchData() {
    if (code !== null) {
      const request = await axios.post(
        process.env.NEXT_PUBLIC_API_URL+"/auth/signin",
        JSON.stringify({ code: code }),
        { headers: { "Content-Type": "application/json" } }
      );
      if (request.data.success === true) {
        sessionStorage.setItem('username', request.data.username)
        sessionStorage.setItem('accessToken', request.data.access_token)
        window.location.reload()
      }
      else {
        console.log(request)
        console.error(request.data.error)
      }
      console.log(code);
    }
  }

  useEffect(() => {
    fetchData();
  }, [code]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center border border-black">
      <div className="h-1/3 w-full border border-black"></div>
      <div className="flex h-1/3 w-full items-center justify-center">
        <button
          className="rounded-md border border-white bg-red-600 p-2 text-white"
          onClick={() => RedirectTo42()}
        >
          Sign In
        </button>
      </div>
      <div className="h-1/3 w-full border border-black"></div>
    </div>
  );
}
