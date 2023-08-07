// Import des bibliothèques nécessaires
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import FightImage from "../utils/images/fightImg.png";
import Loop from "../utils/images/LoopIcon.svg";
import axios from "axios"

// Import des composants et des utilitaires
import { api } from "../utils/api";

// Import des styles
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

// Pusher.logToConsole = true;

interface DefiModalContentProps {
  onClose: () => void;
  socket: any;
}

// Composant principal Defi
export default function DefiModalContent({
  onClose,
  socket,
}: DefiModalContentProps) {
  const my_username = sessionStorage.getItem("username");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  async function refetchUsers(user: string) {
    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/defi/search_user/", JSON.stringify({ username: user }), { headers: { "Content-Type": "application/json" } });
    setUsers(request.data.users);
    console.log(request.data.users)
  }

  useEffect(() => {
    if (username) {
      refetchUsers(username);
    }
  }, [username]);

  // Gestion de la soumission du défi
  const handleDefiSubmit = async (e: any) => {
    e.preventDefault();

    if (username === my_username) {
      toast.error("Vous ne pouvez pas vous inviter vous-même !");
      return;
    }
  };

  return (
    <div className="flex h-[65vh] w-full flex-col items-center justify-center bg-[#EEF0F3]">
      <div className="h[40%] flex w-full flex-col items-center justify-center">
        <Image
          src={FightImage}
          width={100}
          height={100}
          alt="challenge Image"
          className=""
        />
        <p className="w-full bg-gray-400/20 p-5 text-center font-bold">
          Envoie ton invitation de defi a un challenger !
        </p>
      </div>
      <div className="h-[60%] w-full">
        <form
          onSubmit={handleDefiSubmit}
          className="relative flex h-full w-full flex-col items-center gap-2 border"
        >
          <p className="text-gray mr-2 pt-2 text-[10px] font-medium text-[#909090]">
            Commence un defi avec n'importe qui.
          </p>
          <div className="flex w-[50%] rounded-md border-2 border-black bg-white caret-red-500 shadow-xl">
            <Image src={Loop} width={50} height={50} alt="Loop" />
            <input
              type="text"
              placeholder="Recherche par nom d'utilisateur"
              className="w-[80%] rounded-md placeholder:text-[12px] focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="no-scrollbar flex max-h-40 flex-col overflow-y-auto">
            {users?.map((user: any) => (
              <div
                key={user.id}
                className="m-2 flex items-center justify-center rounded-md border border-white/10 bg-[#272A30] p-2 shadow-sm"
              >
                <Image
                  src={user.image}
                  width={50}
                  height={50}
                  alt="user image"
                  className="rounded-md border border-white/10"
                />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setUsername(user.name);
                  }}
                  className="pl-2 text-[12px] text-white/40 hover:text-white/70"
                >
                  {user.name}
                </a>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="absolute bottom-5 rounded-md border border-white bg-red-600 px-4 py-2 text-white shadow-md"
            onClick={() => {
              socket.emit("sendDefi", {
                senderUsername: my_username,
                receiverUsername: username,
              });
              onClose()
            }}
          >
            Envoyer le defi
          </button>
        </form>
      </div>
    </div>
  );
}
