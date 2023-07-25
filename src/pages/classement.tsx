'use client'
import React from "react";
import Navbar from "~/components/Navbar";

interface DataItem {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

const data: DataItem[] = [
  {
    field1: "value1",
    field2: "value2",
    field3: "value3",
    field4: "value4",
    field5: "value5",
  },
  {
    field1: "value5",
    field2: "value6",
    field3: "value7",
    field4: "value8",
    field5: "value9",
  },
];

export default function Classement() {
  return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white-100 mt-4 font-mono">
        <table className="table-auto w-full h-full border-collapse border-1 border-gray-300 shadow-md font-mono">
          <thead>
            <tr className="bg-gray-500/50 text-white font-mono">
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Picture</th>
              <th className="px-4 py-2">Login</th>
              <th className="px-4 py-2">NFT</th>
              <th className="px-4 py-2">Link Intra</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white text-center font-mono' : 'bg-gray-200/25 text-center font-mono'}>
                <td className="border px-4 py-2">{item.field1}</td>
                <td className="border px-4 py-2">{item.field2}</td>
                <td className="border px-4 py-2">{item.field3}</td>
                <td className="border px-4 py-2">{item.field4}</td>
                <td className="border px-4 py-2">{item.field5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}
