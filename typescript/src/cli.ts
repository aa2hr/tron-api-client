#!/usr/bin/env node
import { TronClient, type Network } from "./client.js";

function arg(name: string, fallback?: string) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  const network = (arg("network", process.env.TRON_NETWORK ?? "main") ?? "main") as Network;
  const client = new TronClient({ network, apiKey: process.env.TRON_API_KEY });

  const table: Record<string, () => Promise<unknown>> = {
    get_now_block: () => client.getNowBlock(),
    get_node_info: () => client.getNodeInfo(),
    list_witnesses: () => client.listWitnesses(),
    list_nodes: () => client.listNodes(),
    get_chain_parameters: () => client.getChainParameters(),
    get_asset_issue_list: () => client.getAssetIssueList(),
    get_account: () => client.getAccount(rest[0]),
    get_account_net: () => client.getAccountNet(rest[0]),
    get_account_resource: () => client.getAccountResource(rest[0]),
    get_contract: () => client.getContract(rest[0]),
    get_block_by_num: () => client.getBlockByNum(Number(rest[0])),
    get_block_by_id: () => client.getBlockById(rest[0]),
    get_transaction_by_id: () => client.getTransactionById(rest[0]),
    get_transaction_info_by_id: () => client.getTransactionInfoById(rest[0]),
    get_trc20: () => client.getTrc20Balance(rest[0]),
    get_trc721: () => client.getTrc721(rest[0]),
  };

  if (!cmd || cmd === "help" || !table[cmd]) {
    console.log(`tron <command> [args] [--network main|shasta|nile]\n\nCommands:\n  ${Object.keys(table).join("\n  ")}`);
    process.exit(cmd && cmd !== "help" ? 1 : 0);
  }

  const data = await table[cmd]();
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
