import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
    constructor(private prismaService: PrismaService) { }

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
