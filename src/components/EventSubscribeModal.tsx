import axios from "axios";
import { useEffect, useState } from "react";

interface Event {
    title: string;
    description: string;
    label: string;
    day: number;
    id: number;
    participantsUsernames: string[];
    isFull: boolean;
}

export default function EventSubscribeModal(event: Event) {
    const [eventToSend, setEventToSend] = useState<Event>(event);

    useEffect(() => {
        console.log(event)
        setEventToSend(event);
    }, []);

    return (
        <div>
            <button onClick={
                async () => {
                    console.log("event.id is", eventToSend.id)
                    const request = await axios.post('http://localhost:3333/events/add-user-to-event/', JSON.stringify({ eventId: eventToSend.id, user: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } });
                    console.log(request.data)
                }
            }>Join</button>
            <button>Leave</button>
        </div>
    );
}