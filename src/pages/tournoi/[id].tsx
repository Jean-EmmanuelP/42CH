'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TornamentTreePage() {
    const searchParams = useSearchParams();
    const tournoiName = searchParams.get('id');
    const [tourneyData, setTourneyData] = useState<any[]>([]);
    useEffect(() => {
        if (tournoiName) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/tourney/get_tourney`, {tourneyTitle: tournoiName});
                    setTourneyData(response.data.tourney);
                } catch (error) {
                    console.error("Failed to fetch tourney data:" , error); 
                }
            };
            fetchData();
        }
    }, [tournoiName])
    return (
        <div className='bg-white rounded-md shadow-md h-full w-full'>
            <div className='h-[3%] w-full'></div>
            <div className='h-[97%] w-full border border-black'>
                <p className='flex justify-center text-[26px]'>{tournoiName}</p>

                {tourneyData.map((match, index) => (
                    <div key={index} style={{backgroundColor: match.winner !== 'none' ? 'green' : 'transparent'}}>
                        <p>{match.firstTeam}</p>
                        <p>{match.secondTeam}</p>
                        <p>{match.winner}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}