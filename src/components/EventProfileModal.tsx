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
        <div className="h-[65vh] text-[#02111B] bg-[#D9D9D9] p-2">
            <div className="h-[35%] w-full flex">
                <div className="w-[20%] h-full"></div>
                <div className="w-[60%] h-full flex justify-center"><Image src={userProfile.image} width={150} height={150} alt="userProfile Image" className="rounded-md shadow-md" /></div>
                <div className="w-[20%] h-full relative"><p className="absolute top-2 right-2 font-bold">#25</p></div>
            </div>
            <div className="h-[35%] w-full flex">
                <div className="w-[20%] h-full relative flex justify-center font-bold"><p className="absolute bottom-0">Rank</p></div>
                <div className="w-[60%] h-full flex flex-col">
                    <div className="w-full h-1/3 flex flex-col items-center justify-center"><p className="text-medium">{userProfile.username}</p><p className="text-sm">{userProfile.statusMessage}</p></div>
                    <div className="w-full h-1/3 flex items-center justify-center relative"><p className="font-bold">Wallet: {userProfile.balance}</p></div>
                    <div className="w-full h-1/3 flex justify-center items-center"><p className="font-bold">Statistiques</p></div>
                </div>
                <div className="w-[20%] h-full relative flex justify-center font-bold"><p className="absolute bottom-0">Wallet</p></div>
            </div>
            <div className="h-[30%] w-full gap-2 p-2 flex">
                <div className="w-[50%] h-full border border-black"><p>graphique a prendre du back [Rank]</p></div>
                <div className="w-[50%] h-full border border-black"><p>graphique a prendre du back [Wallet]</p></div>
            </div>
        </div>

    )
}