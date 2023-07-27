import { Controller, Get } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @Post('create')
    async createEvent(@Body() event: { title: string, description: string, label: string, day: number, id: string }) {
        return await this.eventsService.createEvent(event);
    }

    @Get('incoming-events')
    async getIncomingEvents() {
        return await this.eventsService.getIncomingEvents();
    }

    @Post('delete')
    async deleteEvent(@Body() event: { title: string, description: string, label: string, day: number, id: string }) {
        return await this.eventsService.deleteEvent(event);
    }

    @Post('add-user-to-event')
    async addUserToEvent(@Body() event: { eventId: string, user: string }) {
        return await this.eventsService.addUserToEvent(event);
    }

    @Post('remove-user-from-event')
    async removeUserFromEvent(@Body() event: { eventId: string, user: string }) {
        return await this.eventsService.removeUserFromEvent(event);
    }
}
