import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { DefiService } from './defi.service';
import { PrismaService } from 'src/prisma/prisma.service';

let usernameMap = new Map();

@WebSocketGateway(3111, { cors: true })
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
        console.log('res', res)
        if (res.challengeAccepted == true) {
          client.emit('challengeAccepted');
          client.to(data.room).emit('challengeAccepted');
        }
      })
    client.to(data.room).emit('changeAccept', { newAccept: data.newAccept })
  }

  @SubscribeMessage('joinDefi')
  async handleJoinDefi(@MessageBody() data: any, @ConnectedSocket() client: any) {
    console.log("in join defi")
    if (data.username != null) {
      await this.prismaService.user.update({ where: { name: data.username }, data: { status: "online" } })
      usernameMap.set(data.username, client.id);
    }
    console.log(usernameMap)
  }

  @SubscribeMessage('leaveDefi')
  handleLeaveDefi(@MessageBody() data: any, @ConnectedSocket() client: any): void {
    console.log("in leave defi")
    if (data.username != null) {
      this.prismaService.user.update({ where: { name: data.username }, data: { status: "offline" } })
      usernameMap.delete(data.username);
    }
    console.log(usernameMap)
  }

  @SubscribeMessage('sendDefi')
  async handlesendDefi(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    if (data.senderUsername != null && data.receiverUsername != null) {
      const req = await this.defiService.createDefiRequest(data.senderUsername, data.receiverUsername);
      if (req.success == true) {
        const receiverId = usernameMap.get(data.receiverUsername);
        console.log(receiverId)
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
      console.log('avant sent')
      client.to(senderId).emit('receiveDefiId', { defiId: data.defiId })
      console.log('apres sent')
    }
  }
}
