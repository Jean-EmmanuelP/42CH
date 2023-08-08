import Image from "next/image"
import { useEffect, useState } from "react"
import axios from 'axios'

interface UserProfileProps {
    username: string
    image: string
    statusMessage: string
    balance: number
    classment: string
}

export interface UserProfileReceived {
    userProfile: UserProfileProps,
    showAddFriend: boolean
}

export default function EventProfileModal({ userProfile, showAddFriend }: UserProfileReceived) {
    const [usersRanking, setUsersRanking] = useState<{ image: string, username: string, balance: number, statusMessage: string, ranking: string }[]>([])

    async function getUsersRanking() {
        const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/user/three_users_ranking/", JSON.stringify({ username: userProfile.username }), { headers: { 'Content-Type': 'application/json' } })
        if (request.data.success == true)
            setUsersRanking(request.data.usersRanking);
        else
            console.error(request.data.error)
    }

    useEffect(() => {
        getUsersRanking();
    }, [])

    return (
        <div className="h-[65vh] text-white bg-[#272A30] p-2">
            <div className="h-[48%] w-full flex">
                <div className="w-[20%]"></div>
                <div className="relative w-[60%] h-full rounded-md">
                    <Image
                        src={userProfile.image}
                        layout="fill"
                        objectFit="contain"
                        alt="Profile image"
                        className="rounded-md"
                    />
                    <div className="absolute bottom-[-8px] right-[-25px] rounded-full border border-white/10 shadow-md bg-[#272A30] z-50 h-9 w-9 flex items-center justify-center">
                        😋
                    </div>
                </div>
                <div className="w-[20%] flex items-center justify-center h-full">{(sessionStorage.getItem("username") !== userProfile.username && showAddFriend === true) && (<button className="text-[10px] bg-red-500 text-white p-2 rounded-md" onClick={async () => {
                    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/user/add_friend/", JSON.stringify({ username: sessionStorage.getItem("username"), friendUsername: userProfile.username }), { headers: { 'Content-Type': 'application/json' } })
                    if (request.data.success == true)
                        alert("Request sent")
                    else
                        alert(request.data.error);
                }}
                >Add friend</button>)}</div>
            </div>
            <div className="h-[12%] w-full flex">
                <div className="w-[10%]"></div>
                <div className="w-[80%] h-full">
                    <div className="h-[10%]"></div>
                    <div className="h-[40%] text-center">
                        {userProfile.username}
                    </div>
                    <div className="h-[35%] w-full flex items-center justify-center">
                        {
                            userProfile.statusMessage && userProfile.statusMessage.length > 0 && (
                                <div className="p-2 bg-white flex items-center justify-center text-black/75 text-sm italic rounded-md">{userProfile.statusMessage}</div>
                            )
                        }
                    </div>
                    <div className="h-[15%]"></div>
                </div>
                <div className="w-[10%]"></div>
            </div>
            {
                usersRanking.length > 0 ? (
                    <div className="h-[40%] w-full">
                        <div className="h-[20%] w-full flex items-center justify-center gap-2">
                            <div className="h-full w-[33%] bg-white flex items-center justify-center text-black rounded-t-md"><p>👇</p></div>
                            <div className="h-full w-[33%] bg-white flex items-center justify-center text-black rounded-t-md"><p>🏆 {userProfile.classment}</p></div>
                            <div className="h-full w-[33%] bg-white flex items-center justify-center text-black rounded-t-md"><p>💰 {userProfile.balance}</p></div>
                        </div>
                        <div className="flex flex-col h-[80%] w-full pt-1 gap-2 bg-white text-black">
                            <div className="bg-gray-400 h-[33%] w-full flex shadow-md border-y border-black">
                                <div className="relative w-[15%] h-full">

                                    <Image
                                        src={usersRanking[0]!.image}
                                        layout="fill"
                                        objectFit="contain"
                                        alt="User Image"
                                    />
                                </div>
                                <div className="w-[60%] h-full pl-2 flex flex-col justify-center">
                                    <h1 className="font-bold text-[15px]">{usersRanking[0]!.username}</h1>
                                    <h2 className="font-gray-900 text-[12px] pl-4">{usersRanking[0]!.statusMessage !== '' ? usersRanking[0]!.statusMessage : "No message status"}</h2>
                                </div>
                                <div className="w-[25%] flex justify-center items-center">
                                    <h1 className="text-center">#{usersRanking[0]!.ranking}</h1>
                                </div>
                            </div>
                            <div className="bg-gray-400 h-[33%] w-full flex shadow-md border-y border-black">
                                <div className="relative w-[15%] h-full">

                                    <Image
                                        src={usersRanking[1]!.image}
                                        layout="fill"
                                        objectFit="contain"
                                        alt="User Image"
                                    />
                                </div>
                                <div className="w-[60%] h-full pl-2 flex flex-col justify-center">
                                    <h1 className="font-bold text-[15px]">{usersRanking[1]!.username}</h1>
                                    <h2 className="font-gray-900 text-[12px] pl-4">{usersRanking[1]!.statusMessage !== "" ? usersRanking[1]!.statusMessage : "No message status"}</h2>
                                </div>
                                <div className="w-[25%] flex justify-center items-center">
                                    <h1 className="text-center">#{usersRanking[1]!.ranking}</h1>
                                </div>
                            </div>
                            <div className="bg-gray-400 h-[33%] w-full flex shadow-md border-y border-black">
                                <div className="relative w-[15%] h-full">
                                    <Image
                                        src={usersRanking[2]!.image}
                                        layout="fill"
                                        objectFit="contain"
                                        alt="User Image"
                                    />
                                </div>
                                <div className="w-[60%] h-full pl-2 flex flex-col justify-center">
                                    <h1 className="font-bold text-[15px]">{usersRanking[2]!.username}</h1>
                                    <h2 className="font-gray-900 text-[12px] pl-4">{usersRanking[2]!.statusMessage !== '' ? usersRanking[2]!.statusMessage : "No message status"}</h2>
                                </div>
                                <div className="w-[25%] flex justify-center items-center">
                                    <h1 className="text-center">#{usersRanking[2]!.ranking}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div >
    )
}