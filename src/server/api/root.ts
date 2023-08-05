import { createTRPCRouter } from "~/server/api/trpc";
import { defiRouter } from "./routers/defi";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  defi: defiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
