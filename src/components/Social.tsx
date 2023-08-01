import { useState } from "react";

export default function Social() {
  const [bio, setBio] = useState('')

  const handleBioChange = (e:any) => {
    setBio(e.target.value);
  }
  
  return (
    <div className="flex h-full w-full flex-col  rounded-r-md bg-white shadow-md">
      <div className="h-[15%] border-b border-black">
        <p className="w-full border-b border-black pl-4 pt-2 font-bold">
          Social
        </p>
        <div className="flex w-full border-y border-black shadow-sm">
          <div className="relative">
          <img
            src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
            alt="questionMark"
            width={60}
            height={60}
            className=""
          />
          <div className="absolute right-0 bottom-0 transform translate-x-[10%] translate-y-[5%] bg-green-500 w-4 h-4 rounded-full">{''}</div>
          </div>
          <div className="flex flex-col pl-2">
            <p className="text-[11px] flex pt-2">Sebastien Poirier</p>
            <textarea className="text-[8px] resize-none" value={bio} onChange={handleBioChange} placeholder="clique pour changer ta bio"></textarea>
          </div>
        </div>
      </div>
      <div className="h-[30%] w-full border-b border-black">
        <p className="pl-4 pt-2 font-bold">Amis</p>
      </div>
      <div className="h-[55%] w-full border-b border-black">
        <p className="pl-4 pt-2 font-bold">En ligne</p>
      </div>
    </div>
  );
}
