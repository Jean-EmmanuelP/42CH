import React, { useContext } from "react";
import PlusIcon from "~/utils/images/PlusIcon";
import GlobalContext from "../context/GlobalContext";

export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      <PlusIcon></PlusIcon>
      <span className="pl-3 pr-7"> Create</span>
    </button>
  );
}
