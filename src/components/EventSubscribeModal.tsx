import axios from "axios";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

interface Event {
    title: string;
    description: string;
    label: string;
    day: number;
    id: number;
    participantsUsernames: string[];
    isFull: boolean;
}
interface EventSubscribeModalProps {
    eventToSend: Event;
}

export default function EventSubscribeModal(props: EventSubscribeModalProps) {
    const [eventToSend, setEventToSend] = useState<EventSubscribeModalProps>(props);

    useEffect(() => {
        setEventToSend(props)
        console.log("eventToSend is", eventToSend)
    }, [props])

    return (
        <div>
            <button onClick={
                async () => {
                    const request = await axios.post('http://localhost:3333/events/add-user-to-event/', JSON.stringify({ eventId: props.eventToSend.id, user: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } });
                    if (request.data.success == true) {
                        console.log("success")
                    }
                    else {
                        console.error(request.data.error)
                    }
                }
            }>Join</button>
            <button onClick={
                async () => {
                    const request = await axios.post('http://localhost:3333/events/remove-user-from-event/', JSON.stringify({ eventId: props.eventToSend.id, user: sessionStorage.getItem('username') }), { headers: { 'Content-Type': 'application/json' } });
                    if (request.data.success == true) {
                        console.log("success")
                    }
                    else {
                        console.error(request.data.error)
                    }
                }
            }>Leave</button>
        </div >
    );
}