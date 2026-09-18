import { TronApiError } from "./errors.js";

export type Network = "main" | "shasta" | "nile";

const HOSTS: Record<Network, string> = {
  main: "https://api.trongrid.io",
  shasta: "https://api.shasta.trongrid.io",
  nile: "https://nile.trongrid.io",
};

export interface TronClientOptions {
  network?: Network;
  baseUrl?: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

export class TronClient {
  readonly baseUrl: string;
  private apiKey?: string;
  private fetchImpl: typeof fetch;

  constructor(opts: TronClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? HOSTS[opts.network ?? "main"]).replace(/\/$/, "");
    this.apiKey = opts.apiKey;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/json",
    };
    if (this.apiKey) headers["TRON-PRO-API-KEY"] = this.apiKey;
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers: { ...headers, ...init?.headers } });
    const body = await res.json().catch(() => undefined);
    if (!res.ok) throw new TronApiError(res.status, `TRON API ${res.status} ${path}`, body);
    return body as T;
  }

  private post<T>(path: string, json: unknown) {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(json) });
  }

  getNowBlock() {
    return this.request<unknown>("/wallet/getnowblock");
  }

  getBlockByNum(num: number) {
    return this.post<unknown>("/wallet/getblockbynum", { num });
  }

  getBlockById(value: string) {
    return this.post<unknown>("/wallet/getblockbyid", { value });
  }

  getAccount(address: string) {
    return this.post<unknown>("/wallet/getaccount", { address, visible: true });
  }

  getAccountNet(address: string) {
    return this.post<unknown>("/wallet/getaccountnet", { address, visible: true });
  }

  getAccountResource(address: string) {
    return this.post<unknown>("/wallet/getaccountresource", { address, visible: true });
  }

  getContract(value: string) {
    return this.post<unknown>("/wallet/getcontract", { value, visible: true });
  }

  getTransactionById(value: string) {
    return this.post<unknown>("/wallet/gettransactionbyid", { value });
  }

  getTransactionInfoById(value: string) {
    return this.post<unknown>("/wallet/gettransactioninfobyid", { value });
  }

  listWitnesses() {
    return this.request<unknown>("/wallet/listwitnesses");
  }

  listNodes() {
    return this.request<unknown>("/wallet/listnodes");
  }

  getChainParameters() {
    return this.request<unknown>("/wallet/getchainparameters");
  }

  getNodeInfo() {
    return this.request<unknown>("/wallet/getnodeinfo");
  }

  getAssetIssueList() {
    return this.request<unknown>("/wallet/getassetissuelist");
  }

  getTrc20Balance(address: string, limit = 50) {
    return this.request<unknown>(
      `/v1/accounts/${encodeURIComponent(address)}/tokens?limit=${limit}`
    );
  }

  getTrc721(address: string, limit = 50) {
    return this.request<unknown>(
      `/v1/accounts/${encodeURIComponent(address)}/transactions/trc721?limit=${limit}`
    );
  }

  getAccountV1(address: string) {
    return this.request<unknown>(`/v1/accounts/${encodeURIComponent(address)}`);
  }
}
