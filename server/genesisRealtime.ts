import type { WebSocket } from "ws";

export type GenesisCounterSnapshot = {
  registrationCount: number;
  genesisCap: number;
  updatedAt: string;
};

const clients = new Set<WebSocket>();

export function addGenesisClient(socket: WebSocket) {
  clients.add(socket);
  socket.once("close", () => clients.delete(socket));
  socket.once("error", () => clients.delete(socket));
}

export function removeGenesisClient(socket: WebSocket) {
  clients.delete(socket);
}

export function broadcastGenesisCounter(snapshot: GenesisCounterSnapshot) {
  const payload = JSON.stringify({ type: "genesis-counter", ...snapshot });
  clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload);
    else clients.delete(client);
  });
}

export function genesisClientCount() {
  return clients.size;
}
