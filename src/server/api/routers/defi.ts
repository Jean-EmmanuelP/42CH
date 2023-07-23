import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "1639465",
  key: "374519cdfad60d3b237f",
  secret: "5181add9f0ea438fcde7",
  cluster: "eu",
  useTLS: true,
});

export const defiRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        take: 5,
      });
    }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return user?.name || "";
    }),
  getUserDataByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.name,
        },
      });
      return user;
    }),
    
  checkUsername: protectedProcedure
    .input(z.object({ username: z.string(), my_username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.username,
        },
      });
      const userDefiCreator = await ctx.prisma.user.findUnique({
        where: {
          name: input.my_username,
        },
      });

      const UserCreatorId = userDefiCreator?.id;
      if (user) {
        const userId = typeof user.id === "string" ? user.id : undefined;
        pusher.trigger(userId, 'my-channel', {
          "message": `defi de ${input.my_username} | ${UserCreatorId}`
        });
      }
      return user
        ? {
            success: true,
            message: `Defi envoye a ${input.username}...`,
            invitee: `${input.username}`,
          }
        : {
            success: false,
            message: `L'utilisateur ${input.username} n'existe pas...`,
          };
    }),
  acceptChallenge: protectedProcedure
    .input(
      z.object({
        creatorId: z.string(),
        creatorUsername: z.string(),
        uniqueChallengeId: z.string(),
        userId: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        creatorId,
        uniqueChallengeId,
        userId,
        username,
        creatorUsername,
      } = input;
      pusher.trigger(creatorId, 'my-channel', { "message": uniqueChallengeId });
      pusher.trigger(userId, 'my-channel', { "message": uniqueChallengeId });

      return {
        success: true,
        message: `${uniqueChallengeId}`,
        userId: `${userId}`,
        username: `${username}`,
        creatorUsername: `${creatorUsername}`,
      };
    }),
    notifyUserAccepted: protectedProcedure
.input(z.object({ userId: z.string() }))
.mutation(async ({ input, ctx }) => {
  pusher.trigger(input.userId, 'my-channel', { "message": 'user accepted' });
  return { success: true };
}),
});
