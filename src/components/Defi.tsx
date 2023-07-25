import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";
import Pusher from "pusher-js";
import { api } from "~/utils/api";
import axios from "axios";
import { createReactProxyDecoration } from "@trpc/react-query/shared";

const DefiRightBar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setChallengeData } = useContext(GlobalContext);

  // State
  const userId = session?.user.id || "";
  console.log(`userId is`, userId);
  const username = session?.user.name || "";
  console.log(`username is`, username);
  const [challenges, setChallenges] = useState<string[]>([]);
  console.log(`challenges`, challenges);
  const [creatorId, setCreatorId] = useState<string>("");
  console.log(`creatorId`, creatorId);

  // Pusher Setup
  useEffect(() => {
    const pusher = new Pusher("374519cdfad60d3b237f", { cluster: "eu" });
    const channel = pusher.subscribe(userId);

    if (username != null)
      sessionStorage.setItem('username', username);
    // Event Binding
    channel.bind("my-channel", (data: any) => {
      const eventData = data.message.split("|");
      const challengeData = eventData[0];
      const creatorIdentity = eventData[1]?.trim() || "";

      setCreatorId(creatorIdentity);
      setChallenges((prevChallenges) => [...prevChallenges, challengeData]);
    });

    // Reading from Local Storage
    const savedChallenges = localStorage.getItem("challenges");
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }

    return () => {
      pusher.unsubscribe(userId);
    };
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("challenges", JSON.stringify(challenges));
  }, [challenges]);

  // API Call
  const {
    data: creatorIdResponse,
    error,
    isLoading,
  } = api.defi.getUser.useQuery({ id: creatorId });

  // Challenge Acceptance Mutation
  const acceptChallengeMutation = api.defi.acceptChallenge.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        const creatorUsername = result.creatorUsername;
        setChallengeData([userId, username, creatorUsername]);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userId', userId);
        router.push(`/defi/${result.message}`)
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Challenge Acceptance
  const handleAcceptChallenge = async (challengeIndex: number) => {
    if (!isLoading && !error) {
      const uniqueChallengeId = Date.now().toString();
      const creatorUsername = creatorIdResponse;

      acceptChallengeMutation.mutate({
        creatorId,
        creatorUsername,
        uniqueChallengeId,
        userId,
        username,
      });
      await axios.post('http://localhost:3333/defi/create',
        JSON.stringify({ creatorUsername: creatorUsername, opponentUsername: username, }),
        { headers: { 'Content-Type': 'application/json' } })

      setChallenges((prevChallenges) => {
        const newChallenges = prevChallenges.filter(
          (_, index) => index !== challengeIndex
        );
        localStorage.setItem("challenges", JSON.stringify(newChallenges));
        return newChallenges;
      });
    }
  };

  // Challenge Rejection
  const handleRejectChallenge = (challengeIndex: number) => {
    setChallenges((prevChallenges) => {
      const newChallenges = prevChallenges.filter(
        (_, index) => index !== challengeIndex
      );
      localStorage.setItem("challenges", JSON.stringify(newChallenges));
      return newChallenges;
    });
  };

  const handleChallenge = () => {
    router.push("/defi");
  };

  // Render
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-md mt-4 shadow-md bg-white p-5">
      <div>
        <h2 className="text-2xl font-bold mb-4">Mes defis</h2>
        <p className="mb-2 text-gray-600">Mon historique</p>
        <div className="mb-4 overflow-auto">
          {challenges.map((challenge, index) => {
            // Check if challenge contains only digits
            const containsOnlyDigits = /^\d+$/.test(challenge);

            // If challenge does not contain only digits, then display it
            if (!containsOnlyDigits) {
              return (
                <div
                  key={index}
                  className="m-5 flex flex-col items-center gap-4 rounded bg-white p-5 shadow-md"
                >
                  <p className="mb-2 text-xl font-semibold">{challenge}</p>
                  <div>
                    <button
                      className="mr-2 rounded border-2 border-green-500 bg-green-500 p-2 text-white shadow-md"
                      onClick={() => handleAcceptChallenge(index)}
                    >
                      Accepter
                    </button>
                    <button
                      className="rounded border-2 border-red-500 bg-red-500 p-2 text-white shadow-md"
                      onClick={() => handleRejectChallenge(index)}
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
      <div className="self-center mb-4">
        <button
          type="button"
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleChallenge}
        >
          DEFI
        </button>
      </div>
    </div>
  );
};
export default DefiRightBar;
