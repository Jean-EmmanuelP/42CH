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

    const [doubleDimension, setDoubleDimension] = useState<any[][]>()
    const [participants, setParticipants] = useState<number>(0);
    const [rounds, setRounds] = useState<number>(0);

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
                }
                else {
                    console.log(response.data.error);
                }
            };
            fetchData();
        }
    }, [tournoiName])


    async function setRoundsNumber(num: number) {
        let newRounds = 2;
        if (num > 4 && num <= 8)
            newRounds = 3;
        else if (num > 8 && num <= 16)
            newRounds = 4;
        else if (num > 16 && num <= 32)
            newRounds = 5;

        setRounds(newRounds);
    }

    useEffect(() => {
        const count = tourneyData.reduce((acc, curr) => {
            if (curr.column === 0) {
                acc++;
            }
            return acc;
        }, 0);
        setParticipants(count * 2);
        setRoundsNumber(count + 1 / 2)
    }, [tourneyData]);

    useEffect(() => {
        const doubleDimensionArray = new Array(rounds);
        let teams = 0;
        if (rounds === 2) {
            teams = 2;
        }
        else if (rounds === 3) {
            teams = 4;
        }
        else if (rounds === 4) {
            teams = 8;
        }
        else if (rounds === 5) {
            teams = 16;
        }
        for (let i = 0; i < rounds; i++) {
            doubleDimensionArray[i] = new Array(teams);
            for (let j = 0; j < teams; j++) {
                const found = tourneyData.find(element => element.rowPosition === j && element.column === i);
                if (found)
                    doubleDimensionArray[i][j] = found;
                else
                    doubleDimensionArray[i][j] = { firstTeam: "none", secondTeam: "none", winner: "", rowPosition: 0, column: 0 };
            }
            teams = teams / 2;
        }
        setDoubleDimension(doubleDimensionArray);
    }, [rounds, tourneyData])

    useEffect(() => { console.log(doubleDimension) }, [doubleDimension])

    return (
        <div className='bg-white rounded-md shadow-md h-full w-full'>
            <div className={`w-full h-full border border-green-500 flex items-center`}>
                {doubleDimension !== undefined ? (
                    <>
                        {rounds === 2 ? (
                            <>
                                <div className='w-full h-full flex-row'>
                                    <div className='h-[50%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[0]?.firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[0].secondTeam}</p>
                                    </div>
                                    <div className='h-[50%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[1].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-[50%]`}>
                                    <div className='h-full w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[0].secondTeam}</p>
                                    </div>
                                </div>
                            </>) : null}
                        {rounds === 3 ? (
                            <>
                                <div className='w-full h-full flex-row'>
                                    <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[0].secondTeam}</p>
                                    </div>
                                    <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[1].secondTeam}</p>
                                    </div>
                                    <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[2].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[2].secondTeam}</p>
                                    </div>
                                    <div className='h-[25%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[3].firstTeam}ou</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[3].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-[75%]`}>
                                    <div className='h-[33.33%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[0].secondTeam}</p>
                                    </div>
                                    <div className='h-[33.33%] w-full mt-[50%] flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[1].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-[25%]`}>
                                    <div className='h-[98%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[2]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[2]?.[0].secondTeam}</p>
                                    </div>
                                </div>
                            </>) : null}
                        {rounds === 4 ? (
                            <>
                                <div className='w-full h-full flex-row'>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[0].secondTeam}</p>
                                    </div>

                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[1].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[2].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[2].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[3].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[3].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[4].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[4].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[5].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[5].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[6].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[6].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[0]?.[7].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[0]?.[7].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-[87.5%] flex-row`}>
                                    <div className='h-[12.5%] w-full flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[0].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[1].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[2].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[2].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full flex mt-[41%] flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[1]?.[3].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[1]?.[3].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-[75%]`}>

                                    <div className='h-[12.5%] w-full mt-[17.5%] flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[2]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[2]?.[0].secondTeam}</p>
                                    </div>
                                    <div className='h-[12.5%] w-full mt-[122.5%] flex flex-col justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[2]?.[1].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[2]?.[1].secondTeam}</p>
                                    </div>
                                </div>
                                <div className={`w-full h-full`}>
                                    <div className='h-[12.5%] w-full flex flex-col mt-[122.5%] justify-center items-center'>
                                        <p className='w-[65%] bg border border-red-500'>{doubleDimension?.[3]?.[0].firstTeam}</p>
                                        <p className='w-[65%] bg border border-red-500 mt-4'>{doubleDimension?.[3]?.[0].secondTeam}</p>
                                    </div>
                                </div>
                            </>
                        ) : null}
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