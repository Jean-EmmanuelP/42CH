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
}
