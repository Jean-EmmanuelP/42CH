import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import GlobalContext from "~/context/GlobalContext";
import Pusher from 'pusher-js';

export default function HomePage() {
  const { data: session } = useSession();
  const { setChallengeData, challengeData } = useContext(GlobalContext);
  const userId = session?.user.id || "";
  const username = session?.user.name || "";
  const [challenges, setChallenges] = useState<string[]>([]);
  const [creatorId, setCreatorId] = useState<string>("");

  const acceptChallengeMutation = api.defi.acceptChallenge.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        const creatorUsername = result.creatorUsername;
        setChallengeData([userId, username, creatorUsername]);
        console.log(challengeData);
        router.push(`/defi/${result.message}`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    var pusher = new Pusher('374519cdfad60d3b237f', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe(userId);

    channel.bind('my-channel', function(data:any) {
      console.log(data.message);
    
      const eventData = data.message.split("|");
      const challengeData = eventData[0];
      const creatorIdentity = eventData[1]?.trim() || "";
      setCreatorId(creatorIdentity);
      setChallenges((prevChallenges) => {
        const updatedChallenges = [...prevChallenges, challengeData];
        localStorage.setItem("challenges", JSON.stringify(updatedChallenges));
        return updatedChallenges;
      });
    });

    const savedChallenges = localStorage.getItem("challenges");
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }

    return () => {
      pusher.unsubscribe(userId);
    };
  }, [userId]);

  const router = useRouter();

  function handleChallenge() {
    router.push("/defi");
  }

  const {
    data: creatorIdResponse,
    error,
    isLoading,
  } = api.defi.getUser.useQuery({ id: creatorId });

  const handleAcceptChallenge = (challengeIndex: number) => {
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
    }
    setChallenges((prevChallenges) => {
      const newChallenges = prevChallenges.filter(
        (_, index) => index !== challengeIndex
      );
      localStorage.setItem("challenges", JSON.stringify(newChallenges));
      return newChallenges;
    });
  };

  const handleRejectChallenge = (challengeIndex: number) => {
    setChallenges((prevChallenges) => {
      const newChallenges = prevChallenges.filter(
        (_, index) => index !== challengeIndex
      );
      localStorage.setItem("challenges", JSON.stringify(newChallenges));
      return newChallenges;
    });
  };

  return (
    <>
      <Navbar />
      {challenges.map((challenge, index) => (
        <div
          key={index}
          className="m-5 flex flex-col items-center gap-2 rounded bg-gray-500/10 p-2 font-mono shadow-md"
        >
          <p>Nouveau challenge : {challenge}</p>
          <div>
            <button
              className="border-gray mr-2 border bg-green-500/10 p-2 shadow-md"
              onClick={() => handleAcceptChallenge(index)}
            >
              Accepter
            </button>
            <button
              className="border-gray border bg-red-500/10 p-2 shadow-md"
              onClick={() => handleRejectChallenge(index)}
            >
              Refuser
            </button>
          </div>
        </div>
      ))}
      <div className="flex h-screen items-center justify-center">
        <button
          type="button"
          className="rounded-md bg-red-600 px-6 py-3 text-sm font-semibold tracking-widest text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleChallenge}
        >
          DEFI
        </button>
      </div>
    </>
  );
}
