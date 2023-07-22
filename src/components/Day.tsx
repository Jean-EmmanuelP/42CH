import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";

interface DayProps {
  day: dayjs.Dayjs;
  rowIdx: number;
}

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
}

export default function Day({ day, rowIdx }: DayProps) {
  const { setDaySelected, setShowEventModal, filteredEvents, setSelectedEvent } =
    useContext(GlobalContext);
  const [dayEvents, setDayEvents] = useState<Event[]>([]);

  useEffect(() => {
    const events: Event[] = filteredEvents.filter(
      (evt: Event) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? `bg-blue-500 text-white rounded-full w-7`
      : ``;
  }

  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm p-1 my-1 text-center">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt: Event) => (
          <div
            className={`${evt.label} p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}
