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
      });

      socket.on('leave', (data) => {
        socket.leave(data.room);
      });

      socket.on('changeBet', (data) => {
        if (data.username != null)
          this.defiService.changeBet(data.username, data.newBet);
        socket.to(data.room).emit('changeBet', { newBet: data.newBet })
      })

      socket.on('changeHonorBet', (data) => {
        if (data.username != null)
          this.defiService.changeHonorBet(data.username, data.newHonorBet);
        socket.to(data.room).emit('changeHonorBet', { newHonorBet: data.newHonorBet })
      })

      socket.on('changeContract', (data) => {
        if (data.username != null)
          this.defiService.changeContract(data.username, data.newContract);
        socket.to(data.room).emit('changeContract', { newContract: data.newContract })
      })

      socket.on('changeGame', (data) => {
        if (data.username != null)
          this.defiService.changeGame(data.username, data.newGame);
        socket.to(data.room).emit('changeGame', { newGame: data.newGame })
      })

      socket.on('changeAccept', (data) => {
        console.log("ici??")
        if (data.username != null)
          this.defiService.changeAccept(data.username, data.newAccept);
        socket.to(data.room).emit('changeAccept', { newAccept: data.newAccept })
      })
    });
  }
}