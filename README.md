# tron-api-client

TypeScript client (and small CLI) for TRON HTTP / [TronGrid](https://www.trongrid.io/) APIs.

The original 2020 Rust CLI remains under `src/` for reference. Active development is in `typescript/`.

## TypeScript client

```bash
cd typescript
npm install
npm test
npm run build
```

```ts
import { TronClient } from "./src/client.js";

const tron = new TronClient({
  network: "main", // main | shasta | nile
  apiKey: process.env.TRON_API_KEY,
});

const account = await tron.getAccount("T...");
const tip = await tron.getNowBlock();
const tokens = await tron.getTrc20Balance("T...");
```

### CLI

```bash
cd typescript
npx tsx src/cli.ts get_now_block --network main
npx tsx src/cli.ts get_account T...
npx tsx src/cli.ts get_transaction_by_id <txid> --network shasta
```

Environment:

- `TRON_NETWORK` — `main` | `shasta` | `nile`
- `TRON_API_KEY` — optional TronGrid key

### Coverage

Wallet HTTP: now block, block by num/id, account, bandwidth, resources, contract, transactions, witnesses, nodes, chain parameters, TRC10 list.

TronGrid v1: account, TRC20 balances, TRC721 transfers.

## Legacy Rust CLI

`cargo install` / `tron` subcommands from the original oikos-cash library are unchanged in `src/`.

## License

MIT
