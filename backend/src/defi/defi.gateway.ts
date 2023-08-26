import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { DefiService } from './defi.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

let usernameMap = new Map();

@WebSocketGateway()
export class DefiGateway {
  constructor(private defiService: DefiService, private prismaService: PrismaService) { }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: any) {
    client.join(data.room);
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() data: any, @ConnectedSocket() client: any) {
    client.leave(data.room);
  }

  @SubscribeMessage('changeBet')
  handleChangeBet(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    if (data.username != null)
      this.defiService.changeBet(data.username, data.newBet);
    client.to(data.room).emit('changeBet', { newBet: data.newBet });
  }

  @SubscribeMessage('changeHonorBet')
  handleChangeHonorBet(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    if (data.username != null)
      this.defiService.changeHonorBet(data.username, data.newHonorBet);
    client.to(data.room).emit('changeHonorBet', { newHonorBet: data.newHonorBet });
  }

  @SubscribeMessage('changeContract')
  handleChangeContract(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    if (data.username != null)
      this.defiService.changeContract(data.username, data.newContract);
    client.to(data.room).emit('changeContract', { newContract: data.newContract });
  }

  @SubscribeMessage('changeGame')
  handleChangeGame(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    if (data.username != null)
      this.defiService.changeGame(data.username, data.newGame);
    client.to(data.room).emit('changeGame', { newGame: data.newGame });
  }

  @SubscribeMessage('changeAccept')
  async handleChangeAccept(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    if (data.username != null)
      await this.defiService.changeAccept(data.username, data.newAccept).then((res) => {
        if (res.challengeAccepted == true) {
          client.emit('challengeAccepted');
          client.to(data.room).emit('challengeAccepted');
        }
      })
    client.to(data.room).emit('changeAccept', { newAccept: data.newAccept })
  }

  @SubscribeMessage('changeMode')
  async handleChangeMode(@MessageBody() data: any, @ConnectedSocket() client: any) {
    if (data.username != null)
      this.defiService.changeMode(data.username, data.newMode);
    client.to(data.room).emit('changeMode', { newMode: data.newMode });
  }

  @SubscribeMessage('changeComment')
  async handleChangeComment(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    // if (data.username != null)
    //   this.defiService.changeComment(data.username, data.newComment);
    client.to(data.room).emit('changeComment', { newComment: data.newComment });
  }

  @SubscribeMessage('joinDefi')
  async handleJoinDefi(@MessageBody() data: any, @ConnectedSocket() client: any) {
    if (data.username != null) {
      usernameMap.set(data.username, client.id);
    }
  }

  @SubscribeMessage('leaveDefi')
  handleLeaveDefi(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    if (data.username != null) {
      usernameMap.delete(data.username);
    }
  }

  @SubscribeMessage('sendDefi')
  async handlesendDefi(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    if (data.senderUsername != null && data.receiverUsername != null) {
      const req = await this.defiService.createDefiRequest(data.senderUsername, data.receiverUsername);
      if (req.success == true) {
        const receiverId = usernameMap.get(data.receiverUsername);
        if (receiverId == null)
          return;
        client.to(receiverId).emit('receiveDefi');
      }
    }
  }

  @SubscribeMessage('sendDefiId')
  async handlesendDefiId(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    await this.prismaService.defiRequest.delete({ where: { id: data.toDelete } })
    if (data.senderUsername != null) {
      let senderId = usernameMap.get(data.senderUsername);
      client.to(senderId).emit('receiveDefiId', { defiId: data.defiId })
    }
  }
}