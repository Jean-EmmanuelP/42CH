import Image from "next/image"

interface UserProfileProps {
    username: string
    image: string
    statusMessage: string
    balance: number
    classment: string
}

export interface UserProfileReceived {
    userProfile: UserProfileProps
}

export default function EventProfileModal({ userProfile }: UserProfileReceived) {
    return (
        <div className="h-[65vh] text-white bg-[#272A30] p-2">
            <div className="h-[50%] w-full flex">
                <div className="relative w-[60%] h-full border border-white rounded-md shadow-md">
                    <Image
                        src={userProfile.image}
                        layout="fill"
                        objectFit="cover"
                        alt="Profile image"
                    />
                    <div className="absolute bottom-[-8px] right-[-25px] rounded-full border border-white bg-[#272A30] z-50 h-9 w-9 flex items-center justify-center">
                        😋
                    </div>
                </div>
                <div className="w-[40%] h-full pt-2">
                    <div className="h-[20%] w-full bg-white flex">
                        <div className="w-[50%] h-full text-black text-[10px] flex items-center justify-center">Plus de statistiques</div>
                        <div className="w-[50%] h-full text-black text-[10px] flex items-center justify-center">Coming Soon...</div>
                    </div>
                    <div className="h-[80%] w-full flex flex-col">
                        <div className="h-[20%] w-full"></div>
                        <div className="h-[80%] w-full flex justify-center">
                            <div className="flex flex-col gap-2">
                                <p className="text-[35px] text-center">#{userProfile.classment}</p>
                                <p className="text-[15px] text-center">Wallet: {userProfile.balance}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[15%] w-full flex">
                <div className="w-[60%] h-full">
                    <div className="text-center">
                        {userProfile.username}
                        {
                            userProfile.statusMessage.length > 0 && (
                                <div className="p-2 bg-white flex items-center justify-center text-black/75 text-sm italic rounded-md"><div className="relative">{userProfile.statusMessage}<div className="absolute bg-white rotate-45 bg-white w-2 h-2 border-l-50 border-transparent border-r-50 border-t-100 border-black top-[-10px]"></div></div></div>
                            )
                        }
                    </div>
                </div>
                <div className="w-[40%] h-full"></div>
            </div>
            <div className="h-[35%] w-full">
                <div className="h-[20%] w-full flex">
                    <div className="h-full w-[40%] bg-white text-black"><p>The 3 players above you</p></div>
                    <div className="h-full w-[60%]"></div>
                </div>
                <div className="flex flex-col h-[80%] w-full pt-1 gap-2 bg-white text-black">
                    <div className="bg-red-500 h-[33%] w-full flex shadow-md border-y border-black">
                        <div className="relative w-[15%] h-full">

                            <Image
                                src={userProfile.image}
                                layout="fill"
                                objectFit="contain"
                                alt="User Image"
                            />
                        </div>
                        <div className="w-[60%] h-full pl-2 flex flex-col">
                            <h1 className="font-bold text-[12px]">Jean-Emmanuel Perramant</h1>
                            <h2 className="font-gray-900 text-[9px] pl-4">je te mange a tout les jeux</h2>
                        </div>
                        <div className="w-[25%]">
                            <h1 className="text-center">#25</h1>
                        </div>
                    </div>
                    <div className="bg-red-500 h-[33%] w-full flex shadow-md border-y border-black">
                        <div className="relative w-[15%] h-full">

                            <Image
                                src={userProfile.image}
                                layout="fill"
                                objectFit="contain"
                                alt="User Image"
                            />
                        </div>
                        <div className="w-[60%] h-full pl-2 flex flex-col">
                            <h1 className="font-bold text-[12px]">Jean-Emmanuel Perramant</h1>
                            <h2 className="font-gray-900 text-[9px] pl-4">je te mange a tout les jeux</h2>
                        </div>
                        <div className="w-[25%]">
                            <h1 className="text-center">#25</h1>
                        </div>
                    </div>
                    <div className="bg-red-500 h-[33%] w-full flex shadow-md border-y border-black">
                        <div className="relative w-[15%] h-full">

                            <Image
                                src={userProfile.image}
                                layout="fill"
                                objectFit="contain"
                                alt="User Image"
                            />
                        </div>
                        <div className="w-[60%] h-full pl-2 flex flex-col">
                            <h1 className="font-bold text-[12px]">Jean-Emmanuel Perramant</h1>
                            <h2 className="font-gray-900 text-[9px] pl-4">je te mange a tout les jeux</h2>
                        </div>
                        <div className="w-[25%]">
                            <h1 className="text-center">#25</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}