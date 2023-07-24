"use client";

import React, { useEffect, useMemo, useReducer, useState } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

type LabelType = { label: string; checked: boolean };

interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
}

function savedEventsReducer(state: any, { type, payload }: any) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt: any) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt: any) => evt.id !== payload.id);
    default:
      throw new Error();
      break;
  }
}

function initEvents() {
  const storageEvents =
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem("savedEvents")
      : null;
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

function initChallengeData() {
  const storageChallengeData =
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem("challengeData")
      : null;
  return storageChallengeData ? JSON.parse(storageChallengeData) : null;
}

export default function ContextWrapper(props: any) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(0);
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs | null>(dayjs);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );
  const [challengeData, setChallengeData] = useState(initChallengeData);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt: any) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
    }
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels): any => {
      const uniqueLabels = Array.from(
        new Set(savedEvents.map((evt: any) => evt.label))
      );
      return uniqueLabels.map((label) => {
        const currentLabel = prevLabels.find(
          (prevLabel: any) => prevLabel.label === label
        );
        return {
          label,
          checked: !!currentLabel,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("challengeData", JSON.stringify(challengeData));
    }
  }, [challengeData]);

  function updateLabel(updatedLabel: LabelType) {
    setLabels((prevLabels) =>
      prevLabels.map((lbl) =>
        lbl.label === updatedLabel.label ? updatedLabel : lbl
      )
    );
  }

  return (
    <>
      <GlobalContext.Provider
        value={{
          monthIndex,
          setMonthIndex,
          smallCalendarMonth,
          setSmallCalendarMonth,
          daySelected,
          setDaySelected,
          showEventModal,
          setShowEventModal,
          dispatchCalEvent,
          savedEvents,
          selectedEvent,
          setSelectedEvent,
          labels,
          setLabels,
          updateLabel,
          filteredEvents,
          challengeData,
          setChallengeData,
          setWeeklyEvents,
          weeklyEvents
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}
