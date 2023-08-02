import { useState } from "react";

export default function Social() {
  const [bio, setBio] = useState("");

  const handleBioChange = (e: any) => {
    setBio(e.target.value);
  };

  return (
    <div className="flex h-full w-full flex-col  rounded-r-md bg-white shadow-md">
      <div className="h-[15%]">
        <p className="w-full pt-2 pl-4 font-bold">Social</p>
        {/* Start of Card of me */}
        <div className="flex w-full items-center border-y border-black shadow-sm">
          <img
            src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
            alt="questionMark"
            width={60}
            height={60}
            className=""
          />
          <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
            {""}
          </div>
          <div className="flex h-full w-full flex-col pl-2">
            <p className="flex pt-2 text-[12px] font-bold">Sebastien Poirier</p>
            <textarea
              className="h-4 resize-none text-[10px] caret-red-500 focus:outline-none"
              value={bio}
              onChange={handleBioChange}
              placeholder="clique pour changer ta bio"
            ></textarea>
            <div className="flex justify-between px-[2px]">
              <p className="text-[11px] font-bold">Wallet : $50</p>
              <p className="text-[11px] font-bold">#25</p>
            </div>
          </div>
        </div>
        {/* End of Card of me */}
      </div>
      <div className="h-[30%] w-full">
        <p className="pl-4 pt-1 font-bold h-[15%]">Amis</p>
        <div className="flex flex-col gap-4 h-[85%] overflow-y-auto no-scrollbar">
          {/* Start of Card of them */}
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          {/* End of Card of them */}
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
            />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
            />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[55%] w-full border-t border-black">
        <p className="pl-4 pt-1 font-bold h-[10%]">En ligne</p>
        <div className="font-bold h-[90%] overflow-y-auto flex flex-col gap-4 no-scrollbar">
        <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
          <div className="flex w-full items-center border-y border-black shadow-sm">
            <img
              src="https://cdn.intra.42.fr/users/360e47329956d8a4293e03f4113107d2/lgillard.jpg"
              alt="questionMark"
              width={60}
              height={60}
              className=""
              />
            <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
              {""}
            </div>
            <div className="relative flex h-full w-full flex-col pl-2">
              <p className="flex pt-2 text-[12px] font-bold">
                Sebastien Poirier
              </p>
              <p className="h-4 text-[10px] text-black">j'explose tout</p>
              <div className="flex items-center justify-between px-[2px]">
                <p className="text-[11px] font-bold">Wallet : $50</p>
                <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white">
                  Defier
                </button>
              </div>
              <p className="absolute right-2 top-2 text-[11px] font-bold">
                #25
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
