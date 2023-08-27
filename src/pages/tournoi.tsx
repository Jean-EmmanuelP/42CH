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
                console.log(`voici a quoi ressemble la reponse`, response.data); // 404 response we must fix this
                if (response.data && Array.isArray(response.data)) {
                    setTournois(response.data);
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
                <Link href={{pathname: `/tournoi`, query: {id: tournoi.id}}}><li key={index}>tournoi.title</li></Link>
            ))}
        </ul>
    </div>
    )
}