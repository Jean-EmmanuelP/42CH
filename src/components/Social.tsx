import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import EventProfileModal from "./EventProfileModal";
import getConfig from 'next/config';
import DefiModal from "./DefiModalSocial";
const { publicRuntimeConfig } = getConfig();

export default function Social() {
  const [bio, setBio] = useState("");
  const [userProfile, setUserProfile] = useState<{ image: string, username: string, balance: number, statusMessage: string }>({ image: "", username: "", balance: 0, statusMessage: "" })
  const [friends, setFriends] = useState<{ image: string, username: string, balance: number, statusMessage: string }[]>([])
  const [onlineUsers, setOnlineUsers] = useState<{ image: string, username: string, balance: number, statusMessage: string }[]>([])
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [eventToSend, setEventToSend] = useState<{ image: string, username: string, balance: number, statusMessage: string }>({ image: "", username: "", balance: 0, statusMessage: "" });
  const [showDefiModal, setShowDefiModal]= useState<boolean>(false);

  async function getUserProfile() {
    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL+"/user/get_user_infos/", JSON.stringify({ username: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } })

    if (request.data.success == true)
      setUserProfile(request.data.user);
    else
      console.error(request.data.error)
  }

  async function getFriends() {
    const request = await axios.post(process.env.NEXT_PUBLIC_API_URL+"/user/get_friends/", JSON.stringify({ username: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } })

    if (request.data.success == true)
      setFriends(request.data.friends);
    else
      console.error(request.data.error)
  }

  async function getOnlineUsers() {
    const request = await axios.get(process.env.NEXT_PUBLIC_API_URL+"/user/get_online_users/")

    if (request.data.success == true) {
      let toSet = request.data.onlineUsers.filter((user: any) => user.username != sessionStorage.getItem('username'))
      setOnlineUsers(toSet);
    }
    else
      console.error(request.data.error)
  }

  useEffect(() => {
    getUserProfile();
    getFriends();
    getOnlineUsers();
  }, [])

  const handleBioChange = (e: any) => {
    setBio(e.target.value);
  };

  return (
    <div className="flex h-full w-full flex-col  rounded-r-md bg-white shadow-md">
      <div className="h-[15%]">
        <p className="w-full pt-2 pl-4 font-bold">Social</p>
        <div className="flex w-full items-center border-y border-[#612727] shadow-sm">
          <img
            src={userProfile.image}
            alt="User profile image"
            width={60}
            height={60}
            className="hover:cursor-pointer"
            onClick={() => {setShowUserModal(true), setEventToSend(userProfile)}}
          />
          <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
            {""}
          </div>
          <div className="flex h-full w-full flex-col pl-2">
            <p className="flex pt-2 text-[12px] font-bold">{userProfile.username}</p>
            <textarea
              className="h-4 resize-none text-[10px] caret-red-500 focus:outline-none"
              value={userProfile.statusMessage}
              onChange={handleBioChange}
              placeholder="clique pour changer ta bio"
            ></textarea>
            <div className="flex justify-between px-[2px]">
              <p className="text-[11px] font-bold">Wallet : ${userProfile.balance}</p>
              {/* <p className="text-[11px] font-bold">#25</p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[30%] w-full">
        <p className="pl-4 pt-1 font-bold h-[15%]">Amis</p>
        <div className="flex flex-col gap-4 h-[85%] overflow-y-auto no-scrollbar">
          {friends.map((friend: any) => (
            <div key={friend.username} className="flex w-full items-center border-y border-[#612727] shadow-sm">
              <img
                src={friend.image}
                alt="Friend profile image"
                width={60}
                height={60}
                className="hover:cursor-pointer"
                onClick={() => {setShowUserModal(true), setEventToSend(friend)}}
              />
              <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
                {""}
              </div>
              <div className="relative flex h-full w-full flex-col pl-2">
                <p className="flex pt-2 text-[12px] font-bold">
                  {friend.username}
                </p>
                <p className="h-4 text-[10px] text-black font-bold">{friend.statusMessage}</p>
                <div className="flex items-center justify-between px-[2px]">
                  <p className="text-[11px] font-bold">Wallet : ${friend.balance}</p>
                  <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white" onClick={() => {setEventToSend(friend),setShowDefiModal(true)}}>
                    Defier
                  </button>
                </div>
                {/* <p className="absolute right-2 top-2 text-[11px] font-bold">
                  #{friend.rank}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[55%] w-full border-t border-black">
        <p className="pl-4 pt-1 font-bold h-[10%]">En ligne</p>
        <div className="font-bold h-[90%] overflow-y-auto flex flex-col gap-4 no-scrollbar">
          {onlineUsers.map((user: any) => (
            <div key={user.username} className="flex w-full items-center border-y border-[#612727] shadow-sm">
              <img
                src={user.image}
                alt="User profile mage"
                width={60}
                height={60}
                className="hover:cursor-pointer"
                onClick={() => {setShowUserModal(true), setEventToSend(user)}}
              />
              <div className="m-auto ml-[3px] mt-[3px] h-2.5 w-2.5 rounded-full bg-green-500">
                {""}
              </div>
              <div className="relative flex h-full w-full flex-col pl-2">
                <p className="flex pt-2 text-[12px] font-bold">
                  {user.username}
                </p>
                <p className="h-4 text-[10px] text-black font-bold">{user.bio}</p>
                <div className="flex items-center justify-between px-[2px]">
                  <p className="text-[11px] font-bold">Wallet : ${user.balance}</p>
                  <button className="mb-[1px] rounded-md bg-red-600 px-3.5 py-[2px] text-[11px] text-white" onClick={() => {setEventToSend(user),setShowDefiModal(true)}}>
                    Defier
                  </button>
                </div>
                {/* <p className="absolute right-2 top-2 text-[11px] font-bold">
                  #{user.rank}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isVisible={showUserModal} onClose={() => setShowUserModal(false)} width="w-[500px]">
        <EventProfileModal userProfile={eventToSend} />
      </Modal>
      <Modal isVisible={showDefiModal} onClose={() => setShowDefiModal(false)} width="w-[500px]">
        <DefiModal userProfile={eventToSend} />
      </Modal>
    </div>
  );
}
