import { divide } from "lodash"
import Image from "next/image"

interface UserProfileProps {
    username: string
    image: string
    statusMessage: string
    balance: number
}

interface UserProfileReceived {
    userProfile: UserProfileProps
}

export default function EventProfileModal({userProfile}: UserProfileReceived) {
    return (
        <div className="h-[65vh] text-white bg-[#272A30] p-2 border border-red-500">
            <div className="h-[50%] w-full border border-yellow-500 flex">
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
                <div className="w-[40%] h-full border border-orange-500 pt-2">
                    <div className="h-[20%] w-full border border-gray-500 bg-white flex">
                        <div className="w-[50%] h-full text-black text-[10px] flex items-center justify-center">Plus de statistiques</div>
                        <div className="w-[50%] h-full text-black text-[10px] flex items-center justify-center">Coming Soon...</div>
                    </div>
                    <div className="h-[80%] w-full border border-gray-500 flex flex-col">
                        <div className="h-[20%] w-full border border-red-400"></div>
                        <div className="h-[80%] w-full border border-red-400 flex justify-center">
                            <div className="flex flex-col gap-2">
                                <p className="text-[35px] text-center">#25</p>
                                <p className="text-[15px] text-center">Wallet: 203K</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[15%] w-full border border-yellow-500 flex">
                <div className="w-[60%] h-full border border-red-600">
                    <div className="text-center border border-green-500 relative">
                        {userProfile.username}
                        <div className="absolute bottom-[-40px] right-[-30px] px-4 py-4 bg-white flex items-center justify-center text-black/75 text-sm italic rounded-br-md rounded-bl-md rounded-tr-md h-1/2"><div className="relative">{userProfile.statusMessage}<div className="absolute bg-white rotate-45 bg-white w-2 h-2 border-l-50 border-transparent border-r-50 border-t-100 border-black top-[-10px] left-[-14.22px]"></div></div></div>
                    </div>
                </div>
                <div className="w-[40%] h-full border border-red-600"></div>
            </div>
            <div className="h-[35%] w-full border border-yellow-500">
                <div className="h-[20%] w-full border border-red-500 flex">
                    <div className="h-full w-[40%] border border-yellow-500"><p>The 3 players above you</p></div>
                    <div className="h-full w-[60%] border border-yellow-500"></div>
                </div>
                <div className="h-[80%] w-full border border-red-500"></div>
            </div>
        </div>
    )
}