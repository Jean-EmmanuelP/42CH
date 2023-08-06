// Parent Component
import Calendar from "~/components/Calendar";

export default function Calendrier() {
  const username = sessionStorage.getItem('username');
  if (username !== 'jperrama' && username !== 'achatela') {
    return <div className="h-full w-full flex items-center justify-center">
      <p className="bg-red-500 text-white rounded-md shadow-md p-4">You are not allowed to check this page !</p>
    </div>
  }
  return (
    <div className="h-full w-full flex flex-col">
      <Calendar />
    </div>
  );
}
