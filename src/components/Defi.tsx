import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalContext from "~/context/GlobalContext";
import Pusher from "pusher-js";
import { api } from "~/utils/api";
import axios from "axios";
import { createReactProxyDecoration } from "@trpc/react-query/shared";
import Modal from "./Modal";
import DefiModalContent from "./DefiModalContent";

const DefiRightBar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { setChallengeData } = useContext(GlobalContext);

  // State
  const userId = session?.user.id || "";
  const username = session?.user.name || "";
  const [challenges, setChallenges] = useState<string[]>([]);
  const [creatorId, setCreatorId] = useState<string>("");
  const [challengeArray, setChallengeArray] = useState<any[]>([]);

  // console.log(`userId is`, userId);
  // console.log(`username is`, username);
  // console.log(`challenges`, challenges);
  // console.log(`creatorId`, creatorId);

  useEffect(() => {
    console.log('useEffect')
    const request = axios.post('http://localhost:3333/defi/get_all_challenges/',
      JSON.stringify({ username: sessionStorage.getItem('username') }),
      { headers: { 'Content-Type': 'application/json' } })
    request.then((response) => {
      console.log(response.data)
      if (response.data.success === true)
        setChallengeArray(response.data.challenges);
      else {
        console.log(challengeArray)
        console.error(response.data.error)
      }
    })
  }, [])

  useEffect(() => {
    console.log(challengeArray)
  }, [challengeArray])

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

  function extractUsername(email: string) {
    return email.split(" ")[0];
  }

  function sumUp(number1: number, number2: number) {
    return number1 + number2;
  }
  // Render
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-md mt-4 shadow-md bg-white p-5">
      <div>
        <h2 className="text-2xl font-bold">Mes defis</h2>
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
      <div className="bg-white-600 h-full w-full mb-3 overflow-y-auto">
        {challengeArray ? (<p className="mb-2">Defi en cours</p>):(<></>)}
        {challengeArray.map((challenge, index) => {
          return (
            <div className="text-sm w-full border border-gray rounded-md pt-2 pl-2 pb-2 shadow-sm">
              <p className="border-b border-gray p-2">{extractUsername(challenge.creatorName)} - {extractUsername(challenge.opponentName)}</p>
              <div className="p-2 flex flex-col gap-2">
              <p className="">Jeu : {challenge.gameSelected}</p>
              <p className="">Gain potentiel : {sumUp(challenge.creatorBid, challenge.opponentBid)}</p>
              </div>
            </div>
          )
        }
        )}
      </div>
      <div className="self-center mb-4 pb-6">
        <button
          type="button"
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          DEFI
        </button>
      </div>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <DefiModalContent onClose={() => setShowModal(false)}/>
      </Modal>
    </div>
  );
};
export default DefiRightBar;
