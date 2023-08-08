'use client'

import axios from 'axios'
import Image from 'next/image';
import { useEffect, useState } from 'react';


interface AddFriendModalProps {
    onClose: () => void;
}

export default function AddFriendModal({onClose}: AddFriendModalProps) {
    const [username, setUsername] = useState('')
    const [users, setUsers] = useState<any[]>();

    async function refetchUsers(user: string) {
        const request = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/defi/search_user/", JSON.stringify({ username: user }), { headers: { "Content-Type": "application/json" } });
        setUsers(request.data.users);
        console.log(request.data.users)
      }

      useEffect(() => {
        if (username) {
          refetchUsers(username);
        } else {
          refetchUsers('');
        }
      }, [username]);

    return (
        <div className="relative flex h-[20vh] w-full flex-col items-center justify-center bg-[#EEF0F3]">
            <div className='h-[35%] w-full flex items-center justify-center'>
            <input
              type="text"
              placeholder="Recherche par nom d'utilisateur"
              className="w-[80%] rounded-md placeholder:text-[12px] focus:outline-none p-2 shadow-md border border-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="no-scrollbar h-[35%] w-[40%] flex max-h-40 flex-col overflow-y-auto">
            {users?.map((user: any) => (
              <div
                key={user.id}
                className="h-[50%] m-1 flex items-center justify-center rounded-md border border-white/10 bg-[#272A30] py-1 shadow-sm"
              >
                <Image
                  src={user.image}
                  width={25}
                  height={25}
                  alt="user image"
                  className="rounded-md border border-white/10"
                />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setUsername(user.name);
                  }}
                  className="pl-2 text-[12px] text-white/40 hover:text-white/70"
                >
                  {user.name}
                </a>
              </div>
            ))}
          </div>
            <div className='mt-4 h-[30%] flex items-center justify-center'>
            <button
            type="submit"
            className="absolute bottom-5 rounded-md border border-white bg-red-600 px-4 py-2 text-white shadow-md"
            onClick={() => {
                // met la logique pour envoyer la demande dami
                // met une logique : if success pour la demande dami alors on close else tu restes et des que t'as fais ca je mettrai les bons textes
                onClose()
              }}
          >
            Envoyer la demande d'ami
          </button>
            </div>
            
            
          
        </div>
    )
}