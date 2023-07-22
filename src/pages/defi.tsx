import { useSession } from "next-auth/react";
import Navbar from "~/components/Navbar";

import { useState, useEffect, useContext } from "react";
import { api, type RouterOutputs } from "../utils/api";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";

export default function Defi() {
  const { data: sessionData } = useSession();
  const { setChallengeData, challengeData } = useContext(GlobalContext);
  const my_username = sessionData?.user.name;
  const [inviteeName, setInviteeName] = useState("");
  const userId = sessionData?.user.id;
  console.log(userId);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { data: users, refetch: refetchUsers } = api.defi.getUsers.useQuery(
    { query: username },
    {
      // Only perform the query if there is a user session and the username is not empty
      enabled: sessionData?.user !== undefined && username !== "",
    }
  );

  // New code
  const { data: usernameCheckResult, refetch: refetchUsernameCheck } =
    api.defi.checkUsername.useQuery(
      { username, my_username: my_username || "" },
      {
        enabled: false, // don't run the query initially
      }
    );

  useEffect(() => {
    if (username) {
      refetchUsers();
  }
  }, [username, refetchUsers]);

  const handleDefiSubmit = async (e: any) => {
    e.preventDefault();

    // Refetch the username check
    refetchUsernameCheck().then((queryResult) => {
      if (queryResult.isSuccess) {
        const usernameCheckResult = queryResult.data;
        if (usernameCheckResult?.success) {
          const userName = usernameCheckResult.invitee || "";
          console.log(`this is the username`, userName);

          // Move setChallengeData here with updated userName
          setChallengeData([userId, my_username, userName]);

          setInviteeName(userName);
          console.log(usernameCheckResult.message);
          toast.success(usernameCheckResult.message);
        } else {
          console.log(usernameCheckResult.message);
          toast.error(usernameCheckResult.message);
        }
      }
    });
  };

  useEffect(() => {
    const sse = new EventSource(`/api/sse?userId=${userId}`);

    sse.addEventListener("message", (e) => {
      console.log(e.data);
      const eventData = e.data.split("\n");
      const uniqueChallengeId = eventData[0];
      console.log(challengeData);
      router.push(`/defi/${uniqueChallengeId}`);
    });

    return () => {
      sse.close();
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
