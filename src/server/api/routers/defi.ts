import { z } from "zod";
import { Server } from "socket.io";
import { createServer } from "http";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { connections } from "../../../pages/api/sse";

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
        const sse = userId ? connections[userId] : undefined;
        if (sse) {
          sse.write(
            `data: defi de ${input.my_username} | ${UserCreatorId}\n\n`
          );
          sse.flushHeaders();
        }
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
      const sse = connections[creatorId];
      if (sse) {
        sse.write(`data: ${uniqueChallengeId}\n\n`);
        sse.flushHeaders();
      }
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
  const sse = connections[input.userId];
  if (sse) {
    sse.write(`data: user accepted\n\n`);
    sse.flushHeaders();
  }
  return { success: true };
}),
});
