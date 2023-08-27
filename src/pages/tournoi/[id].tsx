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
    {/*
        Je continue demain mais je pense avoir compris comment faire un 
        tree dynamique :
        formule mathematique :
            --> const rounds = Math.log2(teams); car log2 = cb de fois /2 pour arriver a 1 ex: log2(8) = 3
            --> const columns = `grid-cols-${rounds}` ( + 1 ) si je veux afficher le winner a droite sinon rien si je le met en bas
            --> const rows = `grid-rows-${participants / 2}` soit si 8, 4 passent le premier tour simple.
            donc a return :
                div className={`grid ${columns} ${rows} gap-4`}
            Maintenant pour le css : pour que ce soit dynamique il faut que je mette le tout dans un container et que la taille soit toujours
            en fonction du plus grand, ensuite pour le css il faut creer des copies symetrique lun de lautre.
    */}
    return (
        <div className='bg-white rounded-md shadow-md h-full w-full'>
            <div className='h-[3%] w-full'></div>
            <div className='h-[97%] w-full border border-black'>
                <p className='flex justify-center text-[26px] w-full h-[5%]'>{tournoiName}</p>
                {/* {tourneyData.map((match, index) => (
                    <div key={index} style={{backgroundColor: match.winner !== 'none' ? 'green' : 'transparent'}}>
                        <p>{match.firstTeam}</p>
                        <p>{match.secondTeam}</p>
                        <p>{match.winner}</p>
                    </div>
                ))} */}
                <div className='w-full w-full h-[95%]'>a</div>
            </div>
        </div>
    )
}