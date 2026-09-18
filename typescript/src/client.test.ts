import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TronClient } from "./client.js";

describe("TronClient", () => {
  it("uses mainnet host by default", () => {
    const c = new TronClient();
    assert.equal(c.baseUrl, "https://api.trongrid.io");
  });

  it("maps shasta and nile hosts", () => {
    assert.equal(new TronClient({ network: "shasta" }).baseUrl, "https://api.shasta.trongrid.io");
    assert.equal(new TronClient({ network: "nile" }).baseUrl, "https://nile.trongrid.io");
  });

  it("posts JSON and reads body", async () => {
    const fetchImpl = (async (_url: string, init?: RequestInit) => {
      assert.equal(init?.method, "POST");
      return new Response(JSON.stringify({ address: "Txyz" }), { status: 200 });
    }) as typeof fetch;
    const c = new TronClient({ fetchImpl });
    const acc = await c.getAccount("Txyz");
    assert.deepEqual(acc, { address: "Txyz" });
  });
});
