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
      <div className="flex mt-4 mb-4">
        <div id='selectCreator' className="inline w-full text-center border-2 border-white bg-black" onClick={(e) => {
          // set backgroundcolor to white and border and text to black
          const creator = document.getElementById("selectCreator");
          creator!.style.backgroundColor = "white";
          creator!.style.borderColor = "white";
          creator!.style.color = "black";
          // set backgroundcolor to black and border and text to white        
        }}>{contractInformation.creatorName}</div>
        <div className="inline w-full text-center border-2 border-white bg-black">{contractInformation.opponentName}</div>
      </div>
      <input className="block" type="text" placeholder="Mise" />
    </div>
  );
}
