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
    <div className="h-[65vh] bg-[#272A30] p-2 text-white">
      <h1 className="text-center">Challenge Details</h1>
      <div className="flex justify-around">
        <div>
          <img src={contractInformation.creatorImage} alt="Creator" />
          <p>Name: {contractInformation.creatorName}</p>
          <p>Bid: {contractInformation.creatorBid}</p>
        </div>
        <div>
          <img src={contractInformation.opponentImage} alt="Opponent" />
          <p>Name: {contractInformation.opponentName}</p>
          <p>Bid: {contractInformation.opponentBid}</p>
        </div>
      </div>
      <p>Game Selected: {contractInformation.gameSelected}</p>
      <p>Contract Terms: {contractInformation.contractTerms}</p>
      <p>Timer: {contractInformation.timerPublic} seconds</p>
    </div>
  );
}
