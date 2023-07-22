import { Dayjs } from "dayjs";
import React, { Dispatch } from "react";

interface EventAction {
  type: string;
  payload: any;
}

export type LabelType = {
  label: string;
  checked: boolean;
};
interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: Dispatch<number>;
  smallCalendarMonth: number;
  setSmallCalendarMonth: Dispatch<number>;
  daySelected: Dayjs | null;
  setDaySelected: Dispatch<Dayjs | null>;
  showEventModal: boolean;
  setShowEventModal: Dispatch<boolean>;
  dispatchCalEvent: Dispatch<EventAction>;
  savedEvents: any[];
  selectedEvent: any;
  setSelectedEvent: Dispatch<any>;
  labels: LabelType[];
  setLabels: Dispatch<any>;
  updateLabel: Dispatch<any>;
  filteredEvents: any[];
  challengeData: any;
  setChallengeData: Dispatch<any>;
}

const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: null,
  setDaySelected: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: () => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  labels: [],
  setLabels: () => {},
  updateLabel: () => {},
  filteredEvents: [],
  challengeData: null,
  setChallengeData: () => {},
});

export default GlobalContext;
