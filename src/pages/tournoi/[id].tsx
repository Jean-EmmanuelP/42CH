'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TornamentTreePage() {
    const searchParams = useSearchParams();
    const tournoiName = searchParams.get('id');
    const [tourneyData, setTourneyData] = useState<any[]>([
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
        { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 },
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
                if (response.data.success == true) {
                    setTourneyData((prev) => {
                        const newTourneyData = [...prev];
                        for (let i = 0; i < response.data.tourney.length; i++) {
                            newTourneyData[i] = response.data.tourney[i];
                        }
                        return newTourneyData;
                    });
                    console.log("tourney", response.data.tourney)
                }
                else {
                    console.log(response.data.error);
                }
            };
            fetchData();
        }
    }, [])

    function nextTerm(a1: any, a_last: any, n: any) {
        if (n == 1)
            return a1 / 2;
        else {
            return a_last + Math.pow(2, n - 3) * a1;
        }
    }

    async function setRoundsNumber(num: number) {
        if (num <= 4)
            setRounds(2);
        else if (num <= 8)
            setRounds(3);
        else if (num <= 16)
            setRounds(4);
        else if (num <= 32)
            setRounds(5);
    }

    useEffect(() => {
        const count = tourneyData.reduce((acc, curr) => {
            if (curr.column === 0) {
                acc++;
            }
            return acc;
        }, 0);
        setParticipants(count * 2);
        setRoundsNumber(count * 2)
        setRoundsNumber(count / 2)

        let a1 = (100 / count);
        let a_last = 0;
        let marginTopArray: number[] = [];

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
    async function parseName(input: string): Promise<string[]> {
        const Teamboard = input.split(' & ').map(name => name.trim());

        try {
            const request_firstPlayer = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/user/get_user_infos/", { username: Teamboard[0] });
            const request_secondPlayer = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/user/get_user_infos/", { username: Teamboard[1] });
            return [request_firstPlayer.data.user.image, request_secondPlayer.data.user.image];
        } catch (error) {
            console.error("Error fetching user info:", error);
            return ["", ""];
        }
    }
    const [images, setImages] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const firstTeamImages = await parseName(tourneyData[0].firstTeam);
            const secondTeamImages = await parseName(tourneyData[0].secondTeam);
                if (images.length === 0) {
                    setImages([firstTeamImages, secondTeamImages]);
                }
        }
    
        fetchData();
        console.log(`les images:`, images);
    }, [tourneyData])
    return (
        console.log(marginTopArray),

        <div className='bg-white rounded-md shadow-md h-full w-full'>
            <div className={`w-full h-full border border-green-500 flex items-center`}>
                {rounds === 2 ? (
                    <>
                        <div className='w-full h-full flex-row'>
                            <div className='h-[50%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[0].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[0].secondTeam}</p>
                            </div>
                            <div className='h-[50%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[1].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[1].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-[50%]`}>
                            <div className='h-full w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[2].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[2].secondTeam}</p>
                            </div>
                        </div>
                    </>) : null}
                {rounds === 3 ? (
                    <>
                        <div className='w-full h-full flex-row'>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500 rounded-md'>{images[0]}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{images[1]}</p>
                            </div>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[1].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[1].secondTeam}</p>
                            </div>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[2].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[2].secondTeam}</p>
                            </div>
                            <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[3].firstTeam}ou</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[3].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-[75%]`}>
                            <div className='h-[33.33%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[4].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[4].secondTeam}</p>
                            </div>
                            <div className='h-[33.33%] w-full mt-[50%] flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[5].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[5].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-[25%]`}>
                            <div className='h-[98%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[6].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[6].secondTeam}</p>
                            </div>
                        </div>
                    </>) : null}
                {rounds === 4 ? (
                    <>
                        <div className='w-full h-full flex-row'>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[0].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[0].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[1].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[1].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[2].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[2].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[3].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[3].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[4].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[4].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[5].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[5].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[6].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[6].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[7].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[7].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-[87.5%] flex-row`}>
                            <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[8].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[8].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[9].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[9].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[10].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[10].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[11].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[11].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-[75%]`}>

                            <div className='h-[12.5%] w-full mt-[17.5%] flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[12].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[12].secondTeam}</p>
                            </div>
                            <div className='h-[12.5%] w-full mt-[122.5%] flex flex-col justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[13].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[13].secondTeam}</p>
                            </div>
                        </div>
                        <div className={`w-full h-full`}>
                            <div className='h-[12.5%] w-full flex flex-col mt-[122.5%] justify-center items-center'>
                                <p className='w-[65%] bg border border-red-500'>{tourneyData[14].firstTeam}</p>
                                <p className='w-[65%] bg border border-red-500 mt-4'>{tourneyData[14].secondTeam}</p>
                            </div>
                        </div>
                    </>
                ) : null}
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