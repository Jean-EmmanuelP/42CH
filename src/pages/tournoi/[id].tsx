'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { divide } from 'lodash';

export default function TornamentTreePage() {
    const searchParams = useSearchParams();
    const tournoiName = searchParams.get('id');
    const [tourneyData, setTourneyData] = useState<any[]>([]);
    const participants = 8;
    const rounds = Math.log2(participants); // a remplacer par le vrai nombre dequipe
    const columns = `grid-cols-${rounds}`
    const rows = `grid-rows-${participants / 2}`
    const numOfDivs = rounds * ( participants / 2 );
    const numOfRows = participants / 2;
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
    const numOfColumns = rounds;
    function getPaddingForColumn(columnIndex: number) : number {
        console.log(`paddingforcolumn`, columnIndex * 2);
        return (columnIndex * 2);
    }
    return (
        <div className='bg-white rounded-md shadow-md h-full w-full'>
            <div className='h-[3%] w-full'></div>
            <div className='h-[97%] w-full'>
                <p className='text-center text-[26px] w-full h-[5%]'>{tournoiName}</p>
                <div className={`w-full h-[95%] grid ${columns} ${rows} border border-green-500`}>
                    {Array.from({ length: numOfColumns }).map((_, columnIndex) => {
                    let padding = getPaddingForColumn(columnIndex);
                    return (
                        <div key={columnIndex} className={`h-full w-full py-${padding}`}>
                            {Array.from({ length: numOfDivs/numOfColumns }).map((_, rowIndex) => {
                                const cellIndex = columnIndex + rowIndex * numOfColumns;
                                return (
                                    <div key={cellIndex} className='border border-black h-full w-full'>
                                        <div className='h-full w-full flex flex-col'>
                                            <div className='h-full w-full p-2'>
                                                <div className='h-[45%] bg-yellow-300 border border-black'>Equipe 1</div>
                                                <div className='h-[10%]'></div>
                                                <div className='h-[45%] bg-yellow-300 border border-black'>Equipe 2</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    )
}