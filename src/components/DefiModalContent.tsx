// Import des bibliothèques nécessaires
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Pusher from "pusher-js";
import FightImage from "../utils/images/fightImg.png";
import Loop from "../utils/images/LoopIcon.svg";

// Import des composants et des utilitaires
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import GlobalContext from "~/context/GlobalContext";

// Import des styles
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

Pusher.logToConsole = true;

interface DefiModalContentProps {
  onClose: () => void;
  socket: any;
}

// Composant principal Defi
export default function DefiModalContent({
  onClose,
  socket,
}: DefiModalContentProps) {
  // Utilisation des hooks et du contexte
  const my_username = sessionStorage.getItem("username");

  // States pour les entrées utilisateur et les données API
  const [username, setUsername] = useState("");

  // Les appels API
  const { data: users, refetch: refetchUsers } = api.defi.getUsers.useQuery(
    { query: username },
    {
      enabled: my_username !== undefined && username !== "",
    }
  );

  const { data: usernameCheckResult, refetch: refetchUsernameCheck } =
    api.defi.checkUsername.useQuery(
      { username, my_username: my_username || "" },
      {
        enabled: false,
      }
    );

  // Mise à jour de l'utilisateur recherché
  useEffect(() => {
    if (username) {
      refetchUsers();
    }
  }, [username, refetchUsers]);

  // Gestion de la soumission du défi
  const handleDefiSubmit = async (e: any) => {
    e.preventDefault();

    if (username === my_username) {
      toast.error("Vous ne pouvez pas vous inviter vous-même !");
      return;
    }

    refetchUsernameCheck().then((queryResult) => {
      if (queryResult.isSuccess) {
        const usernameCheckResult = queryResult.data;
        if (usernameCheckResult?.success) {
          const userName = usernameCheckResult.invitee || "";
          /* Mettre dans le localStorage */
          // console.log(challengeData);
          toast.success(usernameCheckResult.message);
          onClose();
        } else {
          toast.error(usernameCheckResult.message);
        }
      }
    });
  };

  // Ecoute des notifications Pusher
  // useEffect(() => {
  //   const pusher = new Pusher("374519cdfad60d3b237f", {
  //     cluster: "eu",
  //   });

  //   const channel = pusher.subscribe(userId.toString());

  //   channel.bind("my-channel", (data: any) => {
  //     const uniqueChallengeId = data.message; // ajuster cette ligne en fonction du format de `data`
  //     router.push(`/defi/${uniqueChallengeId}`);
  //   });

  //   return () => {
  //     pusher.unsubscribe(userId.toString());
  //     pusher.disconnect();
  //   };
  // }, [userId]);

  // Retour du composant JSX
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
           <div className="no-scrollbar flex max-h-28 flex-col overflow-y-auto">
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
            }}
          >
            Envoyer le defi
          </button>
        </form>
      </div>
    </div>
  );
}
