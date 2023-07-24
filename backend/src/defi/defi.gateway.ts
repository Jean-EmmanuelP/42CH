import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { DefiService } from './defi.service';

@WebSocketGateway(3130, { cors: true })
export class DefiGateway {
  constructor(private defiService: DefiService) {
    const io = require('socket.io')(3111, {
      cors: {
        origin: '*',
      }
    }
    );
    io.on('connection', (socket) => {

      socket.on('join', (data) => {
        socket.join(data.room);
        // this.defiService.createDefi(data.room, data.username, data.opponentUsername);
        console.log(socket.id + ' joined room ' + data.room);
      });

      socket.on('leave', (data) => {
        socket.leave(data.room);
        console.log(socket.id + ' left room ' + data.room);
      });

      socket.on('changeBet', (data) => {
        socket.to(data.room).emit('changeBet', { newBet: data.newBet })
      })

      socket.on('changeHonorBet', (data) => {
        socket.to(data.room).emit('changeHonorBet', { newHonorBet: data.newHonorBet })
      })

      socket.on('changeContract', (data) => {
        socket.to(data.room).emit('changeContract', { newContract: data.newContract })
      })

      socket.on('changeGame', (data) => {
        socket.to(data.room).emit('changeGame', { newGame: data.newGame })
      })

    });
  }
}