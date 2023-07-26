// Import des bibliothèques nécessaires
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Pusher from "pusher-js";

// Import des composants et des utilitaires
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import GlobalContext from "~/context/GlobalContext";

// Import des styles
import "react-toastify/dist/ReactToastify.css";

Pusher.logToConsole = true;

interface DefiModalContentProps {
  onClose: () => void;
}

// Composant principal Defi
export default function DefiModalContent({onClose}: DefiModalContentProps) {
  // Utilisation des hooks et du contexte
  const { data: sessionData } = useSession();
  const { setChallengeData, challengeData } = useContext(GlobalContext);
  const my_username = sessionData?.user.name;
  const userId = sessionData?.user.id || "";
  const router = useRouter();

  // States pour les entrées utilisateur et les données API
  const [username, setUsername] = useState("");
  const [inviteeName, setInviteeName] = useState("");

  // Les appels API
  const { data: users, refetch: refetchUsers } = api.defi.getUsers.useQuery(
    { query: username },
    {
      enabled: sessionData?.user !== undefined && username !== "",
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
          setChallengeData([userId, my_username, userName]);
          /* Mettre dans le localStorage */
          console.log(challengeData);
          setInviteeName(userName);
          toast.success(usernameCheckResult.message);
          onClose();
        } else {
          toast.error(usernameCheckResult.message);
        }
      }
    });
  };

  // Ecoute des notifications Pusher
  useEffect(() => {
    const pusher = new Pusher("374519cdfad60d3b237f", {
      cluster: "eu",
    });

    const channel = pusher.subscribe(userId.toString());

    channel.bind("my-channel", (data: any) => {
      const uniqueChallengeId = data.message; // ajuster cette ligne en fonction du format de `data`
      router.push(`/defi/${uniqueChallengeId}`);
    });

    return () => {
      pusher.unsubscribe(userId.toString());
      pusher.disconnect();
    };
  }, [userId]);

  // Retour du composant JSX
  return (
    <>
      <ToastContainer />
      <div>
        <p className="mb-4 mt-5 w-full bg-gray-400/25 p-5 text-center font-mono">
          Bienvenue dans l'arene des DEFI
        </p>
        <form
          onSubmit={handleDefiSubmit}
          className="m-2 flex flex-col items-center gap-2 border"
        >
          <p className="mr-2 pt-2 font-bold">Qui veux tu defier ?</p>
          <input
            type="text"
            placeholder="Michel Obama"
            className="mb-1 rounded border border-black p-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {users?.map((user: any) => (
            <div
              key={user.id}
              className="m-2 border border-black bg-cyan-400/25 p-2"
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setUsername(user.name);
                }}
              >
                {user.name}
              </a>
            </div>
          ))}
          <button
            type="submit"
            className="mb-2 mb-4 rounded border border-black bg-green-500 p-2 font-mono"
          >
            Envoyer le defi
          </button>
        </form>
      </div>
    </>
  );
}
