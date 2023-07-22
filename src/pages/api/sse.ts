import { NextApiRequest, NextApiResponse } from "next";

let connections: Record<string, NextApiResponse> = {};
export default (req: NextApiRequest, res: NextApiResponse) => {
  const userId = Array.isArray(req.query.userId)
    ? req.query.userId[0]
    : req.query.userId;
    
  if (!userId) {
    res.status(400).send("User ID is missing");
    return;
  }
  
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();
  connections[userId] = res;

  req.on("close", () => {
    delete connections[userId];
  });
};

export { connections };
