'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { divide, set } from 'lodash';

export default function TornamentTreePage() {
    const searchParams = useSearchParams();
    const tournoiName = searchParams.get('id');
    const [tourneyData, setTourneyData] = useState<any[]>([
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 1, column: 0 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 2, column: 0 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 3, column: 0 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 0, column: 1 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 1, column: 1 },
        { firstTeam: "a & b", secondTeam: "c & e", winner: "", rowPosition: 0, column: 2 },
    ]);
    // const [tourneyData, setTourneyData] = useState<any[]>([]);
    const [participants, setParticipants] = useState<number>(0);
    const [rounds, setRounds] = useState<number>(0);
    const [columns, setColumns] = useState<string>('');
    const [rows, setRows] = useState<string>('');
    // const columns = `grid-cols-${rounds}`
    // const rows = `grid-rows-${participants / 2}`
    // const numOfDivs = rounds * (participants / 2);
    // const numOfRows = participants / 2;
    const [marginTopArray, setMarginTopArray] = useState<number[]>([]);

    useEffect(() => {
        if (tournoiName) {
            const fetchData = async () => {
                const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + `/tourney/get_tourney`, JSON.stringify({ tourneyTitle: tournoiName }), { headers: { 'Content-Type': 'application/json' } });
                if (response.data.success == true)
                    setTourneyData(response.data.tourney);
                else {
                    console.log(response.data.error);
                }
            };
            // fetchData();
        }
    }, [tournoiName])

    function nextTerm(a1: any, a_last: any, n: any) {
        if (n == 1)
            return a1 / 2;
        else {
            return a_last + Math.pow(2, n - 3) * a1;
        }
    }

    useEffect(() => {
        const count = tourneyData.reduce((acc, curr) => {
            if (curr.column === 0) {
                acc++;
            }
            return acc;
        }, 0);
        setParticipants(count * 2);
        setRounds(Math.log2(participants))

        let a1 = (100 / count);
        let a_last = 0;
        let marginTopArray: number[] = [];

        // for (let i = 1; i <= count; i++) {
        //     a_last = nextTerm(a1, a_last, i);
        //     console.log(a_last)
        //     marginTopArray.push(a_last);
        // }
    }, []);
    // }, [tourneyData])

    useEffect(() => {
        if (rounds == 3) {
            setMarginTopArray([12.5, 37.5])
        }
    }, [rounds])


    const numOfColumns = rounds;
    function getPaddingForColumn(columnIndex: number): number {
        return (columnIndex * 2);
    }
    return (
        console.log(marginTopArray),

        <div className='bg-white rounded-md shadow-md h-full w-full'>
            {/* <div className='h-[3%] w-full'></div> */}
            {/* <div className='h-[97%] w-full border border-red-500'> */}
            {/* <p className='text-center text-[26px] w-full h-[5%]'>{tournoiName}</p> */}
            <div className={`w-full h-full border border-green-500 flex items-center`}>
                {rounds === 3 ? (
                    <>
                        <div className='w-full h-full flex-row'>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>

                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                        </div>
                        <div className={`w-full h-[75%]`}>
                            <div className='h-[33.33%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                            <div className='h-[33.33%] w-full mt-[50%] flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                        </div>
                        <div className={`w-full h-[25%]`}>
                            <div className='h-[98%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>coucou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>coucou</p>
                            </div>
                        </div>
                    </>) : null}
            </div>
        </div>
        // </div>
    )
}


// mt-[${marginTopArray[2]}]


















{/* {Array.from({ length: numOfColumns }).map((_, columnIndex) => {
                        const padding = getPaddingForColumn(columnIndex);
                        return (
                            <div key={columnIndex} className={`h-full w-full py-${padding}`}>
                                {Array.from({ length: numOfDivs / numOfColumns }).map((_, rowIndex) => {
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
                    })} */}