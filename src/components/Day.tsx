import React, { useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import GlobalContext from "../context/GlobalContext";
import axios from "axios";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface DayProps {
  day: Dayjs;
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
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    setWeeklyEvents,
    weeklyEvents,
  } = useContext(GlobalContext);

  const [dayEvents, setDayEvents] = useState<Event[]>([]);

  async function setDaily() {
    const request = await axios.get('http://localhost:3333/events/incoming-events/');

    request.data.forEach((element: Event) => {
      element.day = Number(element.day)
    });
    const events: Event[] = request.data.filter((evt: Event) =>
      dayjs(evt.day).isSame(day, "day")
    );
    if (events.length > 0)
      setDayEvents(events);
  }

  async function setWeekly() {
    const today = dayjs();
    const tenDaysFromNow = dayjs().add(10, "day");
    const request = await axios.get('http://localhost:3333/events/incoming-events/');
    request.data.forEach((element: Event) => {
      element.day = Number(element.day)
    });
    const events: Event[] = request.data.filter((evt: Event) =>
      dayjs(evt.day).isSameOrAfter(today) &&
      dayjs(evt.day).isSameOrBefore(tenDaysFromNow)
    );
    if (events.length > 0)
      setWeeklyEvents(events);
  }

  useEffect(() => {
    setDaily()
    setWeekly()
  }, []);

  function getCurrentDayClass() {
    return day.isSame(dayjs(), "day")
      ? `bg-blue-500 text-white rounded-full w-7`
      : ``;
  }

  return (
    <div className="flex flex-col border border-gray-200">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="my-1 p-1 text-center text-sm">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p className={`my-1 p-1 text-center text-sm ${getCurrentDayClass()}`}>
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
            className={`${evt.label} mb-1 mr-3 truncate rounded p-1 text-sm text-gray-600`}
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
