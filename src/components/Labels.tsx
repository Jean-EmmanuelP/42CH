import React, { useContext } from "react";
import GlobalContext, { LabelType } from "../context/GlobalContext";

const colorClasses = {
  red: "bg-red-600",
  orange: "bg-orange-500",
  amber: "bg-amber-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

const colorEvents = {
  red: "Poker",
  orange: "Echec",
  amber: "Ping-Pong",
  green: "Baby-Foot",
  blue: "Billard",
  purple: "Jeu de societe",
};

const extractColor = (label: string) => {
  return label.split("-")[1];
};

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);

  return (
    <>
      <p className="text-gray-500 font-bold mt-10">Label</p>
      {labels.map(({ label: lbl, checked }, idx) => {
        const color = extractColor(lbl);
        const colorClass =
          colorClasses[color as keyof typeof colorClasses] || "bg-blue-500";
        const event = colorEvents[color as keyof typeof colorEvents] || "";
        return (
          <label key={idx} className="items-center mt-3 block">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => updateLabel({ label: lbl, checked: !checked })}
              className={`${colorClass} form-checkbox h-5 w-5 rounded focus:ring-0 cursor-pointer`}
            />
            <span className={`ml-2 capitalize`}>{event}</span>
          </label>
        );
      })}
    </>
  );
}
