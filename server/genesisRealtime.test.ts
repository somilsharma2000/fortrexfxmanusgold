import { describe, expect, it, vi } from "vitest";
import { addGenesisClient, broadcastGenesisCounter, genesisClientCount, removeGenesisClient } from "./genesisRealtime";

function socket(readyState = 1) {
  return { readyState, send: vi.fn(), once: vi.fn() } as any;
}

describe("Genesis realtime hub", () => {
  it("broadcasts a timestamped counter snapshot to connected clients", () => {
    const client = socket();
    addGenesisClient(client);
    broadcastGenesisCounter({ registrationCount: 1843, genesisCap: 10000, updatedAt: "2026-08-16T12:00:00.000Z" });
    expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: "genesis-counter", registrationCount: 1843, genesisCap: 10000, updatedAt: "2026-08-16T12:00:00.000Z" }));
    removeGenesisClient(client);
  });

  it("does not send to closed clients and removes explicit clients", () => {
    const client = socket(3);
    addGenesisClient(client);
    const before = genesisClientCount();
    broadcastGenesisCounter({ registrationCount: 1844, genesisCap: 10000, updatedAt: "2026-08-16T12:01:00.000Z" });
    expect(client.send).not.toHaveBeenCalled();
    removeGenesisClient(client);
    expect(genesisClientCount()).toBe(before - 1);
  });
});
