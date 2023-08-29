import react, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
    const [tourneys, setTourneys] = useState<any[]>([]);
    const getTourney = async () => {
        try {
            const request = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tourney/not_ongoing`);
            
            if (request.data.success) {
                setTourneys(request.data.tourneys);
                console.log(request);
            } else {
                console.error(request.data.error);
            }
        } catch (error) {
            console.error("Error fetching tourneys:", error);
        }
    }
    useEffect(() => {
            getTourney();
            console.log(tourneys);
    },[]);
    useEffect(() => { console.log(`tourneys`, tourneys); }, [tourneys]);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const handleSubmit = async (event:any) => {
        event.preventDefault();
    
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/tourney/start_tourney', {
            adminUsername: sessionStorage.getItem('username'),
            tourneyTitle: selectedOption,
          });
          console.log('Réponse de l\'API:', response.data);
        } catch (error) {
          console.error('Erreur lors de l\'appel à l\'API:', error);
        }
      };
    return (
        <div className="h-full w-full shadow-md bg-white rounded-md">
            <div className="h-[50%] w-full border border-black flex flex-col gap-2 items-center">
                    <h1 className="pt-2">Page d'administration</h1>
                    <form className="flex flex-col gap-2 border border-black px-2 py-4" onSubmit={handleSubmit}>
                        {
                            tourneys.length > 0 ? 
                            (
                                <select name="tournament" id="tournament" onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} className="border border-black rounded-md text-center" required>
                                        <option value="" disabled selected>Select a Tournament</option>
                                        {
                                        tourneys.map((tourney:any) => (
                                            <option value={`${tourney}`}>{tourney}</option>
                                            ))
                                        }
                                </select>
                        ): (<p>No tournament avalaible</p>)}
                        <button className="border border-black shadow-md rounded-md bg-red-500 text-white" type="submit">Demarrer le tournoi</button>
                    </form>
            </div>
            <div className="h-[50%] w-full border border-black">
                
            </div>
        </div>
    )
}