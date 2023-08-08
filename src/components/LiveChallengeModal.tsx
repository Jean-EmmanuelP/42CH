import { useEffect, useState } from "react";
import axios from 'axios'

interface publicChallenge {
  id: string;
  creatorName: string;
  opponentName: string;
  creatorImage: string;
  opponentImage: string;
  creatorBid: number;
  opponentBid: number;
  gameSelected: string;
  contractTerms: string;
  timerPublic: number;
}

interface LiveChallengeModalProps {
  contractInformation: publicChallenge;
}

export default function LiveChallengeModal({
  contractInformation,
}: LiveChallengeModalProps) {

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [userBet, setUserBet] = useState<string>('0');

  async function getBalance() {
    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/user/get_user_infos/", JSON.stringify({ username: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } })
    if (request.data.success == true)
      setBalance(request.data.user.balance);
    else
      console.error(request.data.error)
  }

  useEffect(() => {
    getBalance()
  }, [])

  const handleUserBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > balance) {
      setUserBet(String(balance));
    }
    else {
      setUserBet(event.target.value)
    }
  };

  return (
    <div className="h-[65vh] bg-[#272A30] p-2 text-white overflow-y-auto">
      <h1 className="text-center">Challenge Details</h1>
      <div className="flex justify-around">
        <div className="w-full h-[50%] mr-2">
          <img src={contractInformation.creatorImage} alt="Creator" />
          <p className="text-center">{contractInformation.creatorName}</p>
          <p className="text-center">Mise: {contractInformation.creatorBid}</p>
        </div>
        <div className="w-full h-[50%]">
          <img src={contractInformation.opponentImage} alt="Opponent" />
          <p className="text-center">{contractInformation.opponentName}</p>
          <p className="text-center">Mise: {contractInformation.opponentBid}</p>
        </div>
      </div>
      <p className="text-center text-xl">Jeu selectionné:</p>
      <p className="text-center text-sm">{contractInformation.gameSelected}</p>
      <p className="text-center text-xl">Termes du contrat:</p>
      <p className="text-center text-sm">{contractInformation.contractTerms}</p>
      {/* <p>Timer: {contractInformation.timerPublic} seconds</p> */}
      <p>Mise sur le vainqueur:</p>
      <div className="flex mt-4 mb-4">
        <div id='selectCreator' className="inline w-full text-center border-2 border-white bg-black" onClick={() => {
          // set backgroundcolor to white and border and text to black
          const creator = document.getElementById("selectCreator");
          creator!.style.backgroundColor = "white";
          creator!.style.borderColor = "white";
          creator!.style.color = "black";
          const opponent = document.getElementById("selectOpponent");
          opponent!.style.backgroundColor = "black";
          opponent!.style.borderColor = "white";
          opponent!.style.color = "white";
          setSelectedUser(contractInformation.creatorName)
          // set backgroundcolor to black and border and text to white        
        }}>{contractInformation.creatorName}</div>
        <div id='selectOpponent' className="inline w-full text-center border-2 border-white bg-black" onClick={() => {
          // set backgroundcolor to white and border and text to black
          const opponent = document.getElementById("selectOpponent");
          opponent!.style.backgroundColor = "white";
          opponent!.style.borderColor = "white";
          opponent!.style.color = "black";
          const creator = document.getElementById("selectCreator");
          creator!.style.backgroundColor = "black";
          creator!.style.borderColor = "white";
          creator!.style.color = "white";
          setSelectedUser(contractInformation.opponentName)
          // set backgroundcolor to black and border and text to white
        }}>{contractInformation.opponentName}</div>
      </div>
      <input className="block text-black" type="number" placeholder="Mise" min={0} onChange={handleUserBetChange} value={userBet} />
      <button className="w-full mt-2 border-4 border-white bg-color-black" onClick={async () => {
        if (userBet == '0') {
          alert('La mise doit être supérieure à 0')
          return;
        }
        if (selectedUser == "") {
          alert("Un utilisateur doit être selectionné")
          return;
        }
        const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/defi/bet_public_challenge/", JSON.stringify({ username: sessionStorage.getItem("username"), challengeId: contractInformation.id, amount: Number(userBet), winner: selectedUser }), { headers: { "Content-Type": "application/json" } });

        if (request.data.success == true) {
          alert("Mise validée !") // peut-être renvoyé le nouveau montant si bet déjà eu lieu
        }
        else
          alert(request.data.error)
      }}>Miser</button>
    </div>
  );
}
