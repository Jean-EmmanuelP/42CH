'use client'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

{/* va dans le catch error */}
export default function tournoi() {
    const [tournois, setTournois] = useState<any[]>([]);

    useEffect(() => {
        const fetchTournois = async () => {
            try {
                const response  = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/tourney/get_ongoing');
                console.log(`voici a quoi ressemble la reponse`, response.data);
                if (response.data && Array.isArray(response.data.tourneys)) {
                    setTournois(response.data.tourneys);
                }
            } catch(error) {
                console.log("Erreur lors de la recuperation des donnees de tournois...:", error);
            }
        };
        fetchTournois();
    }, [])
    return (
    <div className="h-full w-full bg-white rounded-md shadow-md">
        <h1 className="items-center justify-center flex pt-2">Tournoi en cours :</h1>
        <ul>
            {tournois.map((tournoi, index) => (
                <Link href={`/tournoi/${tournoi}`}><li key={index}>{tournoi}</li></Link>
            ))}
        </ul>
    </div>
    )
}