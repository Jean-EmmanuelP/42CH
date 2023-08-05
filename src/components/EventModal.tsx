import React, { useContext, useState } from "react";
import DragHandle from "~/utils/images/DragHandle";
import Close from "~/utils/images/Close";
import GlobalContext from "../context/GlobalContext";
import Schedule from "~/utils/images/Schedule";
import Segment from "~/utils/images/Segment";
import BookMarkBorder from "~/utils/images/BookMarkBorder";
import Check from "~/utils/images/Check";
import Delete from "~/utils/images/Delete";
import axios from "axios";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const labelsClasses = [
  "bg-red-600",
  "bg-orange-500",
  "bg-amber-400",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    setSelectedEvent,
  } = useContext(GlobalContext);
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [limitedSeats, setLimitedSeats] = useState<number>(-1);
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Title cannot be empty!");
      return;
    }

    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected?.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      limitedSeats,
    };
    const request = await axios.post(publicRuntimeConfig.NEXT_PUBLIC_API_URL+'/events/create/', calendarEvent);
    if (request.data.success == true) {
      // reload le state qui contient tous les events
      window.location.reload();
    }
    else {
      console.error(request.data.error)
    }

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    const test = await axios.get(publicRuntimeConfig.NEXT_PUBLIC_API_URL+'/events/incoming-events/');
    console.log(test.data)
    setShowEventModal(false);
    setSelectedEvent(null);
    setTitle("");
    setDescription("");
    setSelectedLabel(labelsClasses[0]);
  }

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="text-gray-400">
            <DragHandle />
          </span>
          <div className="flex flex-row">
            {selectedEvent && (
              <span
                className="text-gray-400 cursor-pointer"
                onClick={async () => {
                  const request = await axios.post(publicRuntimeConfig.NEXT_PUBLIC_API_URL+'/events/delete/', selectedEvent);
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                  window.location.reload();
                }}
              >
                <Delete />
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="text-gray-400">
                <Close />
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring- 0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="text-gray-400">
              <Schedule />
            </span>
            <p>{daySelected && daySelected.format("dddd, MMMM DD")}</p>
            <span className="text-gray-400">
              <Segment />
            </span>
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring- 0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />
            <span>
              <BookMarkBorder />
              <button className="rounded border border-black bg-white p-2" onClick={() => { }}><p>clique si event de la semaine</p></button>
              <label htmlFor="limitedseats">Nombre de place:</label>
              <input type="number" id="number" max={100} min={-1} name="limitedseats" value={limitedSeats} onChange={(e) => setLimitedSeats(parseInt(e.target.value))} className="rounded border border-black bg-white" />
            </span>
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`${lblClass} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span>
                      <Check />
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-end w-100 border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover: bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
