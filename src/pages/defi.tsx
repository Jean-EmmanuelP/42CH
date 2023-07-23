import { useSession } from "next-auth/react";
import Navbar from "~/components/Navbar";
import { useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";
import Pusher from "pusher-js";

Pusher.logToConsole = true;

export default function Defi() {
  const { data: sessionData } = useSession();
  const { setChallengeData, challengeData } = useContext(GlobalContext);
  const my_username = sessionData?.user.name;
  const [inviteeName, setInviteeName] = useState("");
  const userId = sessionData?.user.id || "";
  const router = useRouter();
  const [username, setUsername] = useState("");
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

  useEffect(() => {
    if (username) {
      refetchUsers();
  }
  }, [username, refetchUsers]);

  const handleDefiSubmit = async (e: any) => {
    e.preventDefault();
    refetchUsernameCheck().then((queryResult) => {
      if (queryResult.isSuccess) {
        const usernameCheckResult = queryResult.data;
        if (usernameCheckResult?.success) {
          const userName = usernameCheckResult.invitee || "";
          setChallengeData([userId, my_username, userName]);
          setInviteeName(userName);
          toast.success(usernameCheckResult.message);
        } else {
          toast.error(usernameCheckResult.message);
        }
      }
    });
  };

  useEffect(() => {
    const pusher = new Pusher('374519cdfad60d3b237f', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe(userId.toString());

    channel.bind("my-channel", (data: any) => {
      // console.log("Received data: ", data);
      const uniqueChallengeId = data.message; // adjust this line based on the format of `data`
      router.push(`/defi/${uniqueChallengeId}`);
    });

    return () => {
      pusher.unsubscribe(userId.toString());
      pusher.disconnect();
    };
  }, [userId]);

  return (
    <>
      <ToastContainer />
      <Navbar />
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
            placeholder="pseudo: @jperrama"
            className="mb-1 rounded border border-black p-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {users?.map((user: any) => (
            <div key={user.id}>{user.name}</div>
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
