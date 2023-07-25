"use client";

import { useState, useContext, useEffect } from "react";
import React from "react";
import CalendarHeader from "./CalendarHeader";
import Month from "./Month";
import Sidebar from "./Sidebar";
import { getMonth } from "~/utils/util";
import GlobalContext from "../context/GlobalContext";
import EventModal from "./EventModal";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <div className="mt-4 ml-2 h-full">
      {showEventModal && <EventModal />}
        <div className="font-mono bg-gray-500/5 flex flex-col h-full flex-grow shadow-lg">
          <CalendarHeader />
          <div className="flex flex-1">
            <Sidebar />
            <Month month={currentMonth} />
          </div>
        </div>
    </div>
  );
}
