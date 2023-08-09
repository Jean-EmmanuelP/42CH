'use client'
import React, { useState, useEffect, use } from "react";
import Navbar from "~/components/Navbar";
import axios from 'axios'
import rightArrow from "../utils/images/rightArrow.svg"
import leftArrow from "../utils/images/leftArrow.svg"
import Image from "next/image";

interface DataItem {
  ranking: number;
  image: string;
  login: string;
  balance: number;
}

export default function Classement() {
  const [data, setData] = useState<DataItem[]>();
  const [pageCount, setPageCount] = useState<number>(1);
  const [trigger, setTrigger] = useState<boolean>(false);

  async function getDataAsync() {
    const request = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/classement/' + String(pageCount) + '/');
    if (request.data.success == true) {
      setData(request.data.usersRanking);
      setTrigger(!trigger);
    }
  }

  useEffect(() => {
    getDataAsync();
  }, []);

  useEffect(() => {
    getDataAsync();
  }, [pageCount]);

  useEffect(() => {
    if (data != undefined && data!.length != 10) {
      // set the remaining users to 0
      for (let i = data!.length; i < 10; i++) {
        data!.push({ ranking: 0, image: '', login: '', balance: 0 });
      }
    }
  }, [trigger]);

  return (
    <div className="inset-0 top-[10%] h-full flex flex-col items-center justify-center bg-white-100 font-mono">
      <div className="h-[10%] flex space-x-2 pb-2 w-full justify-center">
        <button onClick={() => {
          if (pageCount > 1)
            setPageCount(pageCount - 1)
        }}><Image src={leftArrow} width={40} height={40} alt="left arrow" /></button>
        <button onClick={() => {
          if (data != undefined && data!.some((item) => item.ranking == 0) == false)
            setPageCount(pageCount + 1)
        }}><Image src={rightArrow} width={40} height={40} alt="left arrow" /></button>
      </div>
      <div className="flex items-center justify-between bg-gray-500/50 text-white font-mono h-[10%] w-full">
          <p className="px-4 py-2 text-xl">🏆</p>
          <p className="px-4 py-2 text-xl">👶</p>
          <p className="px-4 py-2 text-xl">🗣️</p>
          <p className="px-4 py-2 text-xl">💰</p>
      </div>
      <div className="w-full h-[80%] shadow-md overflow-auto">
        <table className="table-auto w-full h-full border-collapse border-1 border-gray-300 shadow-md font-mono">
          <tbody>
            {data != undefined ? (data!.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white text-center font-mono h-[9%]' : 'bg-gray-200/25 text-center font-mono'}>
                <td className="border px-4 py-2">{item.ranking}</td>
                <td className="border px-4 py-2"><img className="w-10 h-10 rounded-full mx-auto" src={item.image} /></td>
                <td className="border px-4 py-2">{item.login}</td>
                <td className="border px-4 py-2">{item.balance}</td>
              </tr>
            ))) : <p>Il n'y a pas d'utilisateurs sur cette page</p>}
          </tbody>
        </table>
      </div>
    </div>
  );

}
