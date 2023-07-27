import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
    constructor(private prismaService: PrismaService) { }

    async removeUserFromEvent(event: { eventId: string; user: string; }) {
        const { eventId, user } = event;
        const userExists = await this.prismaService.user.findFirst({ where: { name: user } })
        if (userExists == null) {
            return { success: false, error: "User not found" }
        }
        const selectedEvent = await this.prismaService.event.findFirst({ where: { id: eventId } })
        if (selectedEvent == null) {
            return { success: false, error: "Event not found" }
        }
        else {
            const updatedEvent = await this.prismaService.event.update({ where: { id: eventId }, data: { participantsUsernames: { set: selectedEvent.participantsUsernames.filter((username) => username != userExists.name) } } })
            return { success: true }
        }
    }

    async addUserToEvent(eventId: string, user: string) {
        console.log(eventId, user)
        const userExists = await this.prismaService.user.findFirst({ where: { name: user } })
        if (userExists == null) {
            return { success: false, error: "User not found" }
        }
        const selectedEvent = await this.prismaService.event.findFirst({ where: { id: eventId } })
        if (selectedEvent.isFull == true) {
            return { success: false, error: "Event is full" }
        }
        if (selectedEvent == null) {
            return { success: false, error: "Event not found" }
        }
        else if (selectedEvent.limitedSeats != null) {
            if (selectedEvent.limitedSeats == selectedEvent.participantsUsernames.length) {
                await this.prismaService.event.update({ where: { id: eventId }, data: { isFull: true } })
                return { success: false, error: "Event is full" }
            }
            else {
                const updatedEvent = await this.prismaService.event.update({ where: { id: eventId }, data: { participantsUsernames: { push: userExists.name } } })
                if (updatedEvent.limitedSeats == updatedEvent.participantsUsernames.length) {
                    await this.prismaService.event.update({ where: { id: eventId }, data: { isFull: true } })
                }
                console.log(updatedEvent)
                return { success: true }
            }
        }
    }

    async deleteEvent(event: { title: string; description: string; label: string; day: number; id: string; }) {
        const { title, description, label, day, id } = event;
        const stringDay = day.toString();
        const deletedEvent = await this.prismaService.event.findFirst({ where: { title: title, description: description, label: label, day: stringDay } })
        await this.prismaService.event.delete({ where: { id: deletedEvent.id } })
        return { success: true }
    }

    async getIncomingEvents() {
        //findMany will return all events 
        const events = await this.prismaService.event.findMany();
        // console.log(events)
        return events;
    }

    async createEvent(event: { title: string, description: string, label: string, day: number, id: string }) {
        const { title, description, label, day, id } = event;
        const stringDay = day.toString();
        const createdEvent = await this.prismaService.event.create({ data: { title: title, description: description, label: label, day: stringDay } })
        if (createdEvent == null) {
            return { success: false, error: "Event not created" }
        }
        return { success: true }
    }
}
