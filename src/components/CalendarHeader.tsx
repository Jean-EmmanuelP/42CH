import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import ChevronLeft from "~/utils/images/ChevronLeft";
import ChevronRight from "~/utils/images/ChevronRight";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }
  return (
    <React.Fragment>
      <header className="px-4 py-2 flex items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png"
          width="20px"
          height="20px"
          alt="logo google calendar"
          className="mr-2 w-12 h-12"
        />
        <h1 className="mr-10 text-xl text-gray-500 font-bold text-black"> Calendar</h1>
        <button onClick={handleReset} className="border border-black rounded py-2 px-4 mr-5 bg-cyan-300/25">
          Today
        </button>
        <button className="mr-4" onClick={handlePrevMonth}>
          <span className="cursor-pointer text-gray-600 mx-2">
            <ChevronLeft />
          </span>
        </button>
        <button onClick={handleNextMonth}>
          <span className="cursor-pointer text-gray-600 mx-2">
            <ChevronRight />
          </span>
        </button>
        <h2 className="ml-4 text-xl text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </h2>
      </header>
    </React.Fragment>
  );
}
