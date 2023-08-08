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
        if (selectedEvent.participantsUsernames.includes(userExists.name) == false) {
            return { success: false, error: "User not in event" }
        }
        if (selectedEvent == null) {
            return { success: false, error: "Event not found" }
        }
        else {
            const updatedEvent = await this.prismaService.event.update({ where: { id: eventId }, data: { participantsUsernames: { set: selectedEvent.participantsUsernames.filter((username) => username != userExists.name) } } })
            return { success: true }
        }
    }

    async addUserToEvent(eventId: string, user: string) {
        const userExists = await this.prismaService.user.findUnique({ where: { name: user } })
        if (userExists == null) {
            return { success: false, error: "User not found" }
        }
        const selectedEvent = await this.prismaService.event.findUnique({ where: { id: eventId } })
        if (selectedEvent.isFull == true) {
            return { success: false, error: "Event is full" }
        }
        if (selectedEvent.participantsUsernames.includes(userExists.name)) {
            return { success: false, error: "User already in event" }
        }
        if (selectedEvent == null) {
            return { success: false, error: "Event not found" }
        }
        if (selectedEvent.limitedSeats != -1) {
            if (selectedEvent.limitedSeats == selectedEvent.participantsUsernames.length) {
                await this.prismaService.event.update({ where: { id: eventId }, data: { isFull: true } })
                return { success: false, error: "Event is full" }
            }
            else {
                const updatedEvent = await this.prismaService.event.update({ where: { id: eventId }, data: { participantsUsernames: { push: userExists.name } } })
                if (updatedEvent.limitedSeats == updatedEvent.participantsUsernames.length) {
                    await this.prismaService.event.update({ where: { id: eventId }, data: { isFull: true } })
                }
                return { success: true }
            }
        }
        else {
            const updatedEvent = await this.prismaService.event.update({ where: { id: eventId }, data: { participantsUsernames: { push: userExists.name } } })
            return { success: true }
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
        const events = await this.prismaService.event.findMany();
        return events;
    }

    async createEvent(event: { title: string, description: string, label: string, day: number, id: string, limitedSeats: number, isEventOfTheWeek: boolean }) {
        const { title, description, label, day, id, isEventOfTheWeek } = event;
        const stringDay = day.toString();
        const intLimited = parseInt(event.limitedSeats.toString())
        const createdEvent = await this.prismaService.event.create({ data: { title: title, description: description, label: label, day: stringDay, limitedSeats: intLimited, isEventOfTheWeek:isEventOfTheWeek } })
        if (createdEvent == null) {
            return { success: false, error: "Event not created" }
        }
        return { success: true }
    }
}