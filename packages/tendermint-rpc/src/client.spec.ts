import { Encoding } from "@iov/crypto";

import { v0_20 } from "./adaptor";
import { Client } from "./client";
import { QueryString } from "./encodings";
import * as responses from "./responses";
import { HttpClient } from "./rpcclient";

const skipTests = (): boolean => !process.env.TENDERMINT_ENABLED;

const pendingWithoutTendermint = () => {
  if (skipTests()) {
    pending("Set TENDERMINT_ENABLED to run tendermint rpc tests");
  }
};

// TODO: make flexible, support multiple versions, etc...
const tendermintUrl = "http://localhost:12345";

describe("Verify client calls on tendermint w/ kvstore app", () => {
  it("Tries to connect with known version to tendermint", () => {
    pendingWithoutTendermint();
    const client = new Client(new HttpClient(tendermintUrl), v0_20);
    return client.abciInfo().catch(err => fail(err));
  });

  it("Tries to auto-discover tendermint", () => {
    pendingWithoutTendermint();
    return Client.detectVersion(new HttpClient(tendermintUrl))
      .then(client => client.abciInfo())
      .catch(err => fail(err));
  });

  it("Posts a transaction", () => {
    pendingWithoutTendermint();
    const client = new Client(new HttpClient(tendermintUrl), v0_20);
    const tx = Encoding.asAscii("hello=byte");

    const verifyResponse = (res: responses.BroadcastTxCommitResponse) => {
      expect(res.height).toBeGreaterThan(2);
      expect(res.hash.length).toEqual(20);
      // verify success
      expect(res.checkTx.code).toBeFalsy();
      expect(res.deliverTx).toBeTruthy();
      if (res.deliverTx) {
        expect(res.deliverTx.code).toBeFalsy();
      }
    };

    return client
      .broadcastTxCommit({ tx: tx })
      .then(verifyResponse)
      .catch(err => fail(err));
  });

  it("Queries the state", () => {
    pendingWithoutTendermint();
    const client = new Client(new HttpClient(tendermintUrl), v0_20);

    const key = Encoding.asAscii("hello");
    const value = Encoding.asAscii("byte");
    const queryParams = { path: "/key", data: key };

    const verifyQuery = (res: responses.AbciQueryResponse) => {
      expect(new Uint8Array(res.key)).toEqual(key);
      expect(new Uint8Array(res.value)).toEqual(value);
      expect(res.code).toBeFalsy();
    };

    return client
      .abciQuery(queryParams)
      .then(verifyQuery)
      .catch(err => fail(err));
  });

  it("Sanity check - calls don't error", () => {
    pendingWithoutTendermint();
    const client = new Client(new HttpClient(tendermintUrl), v0_20);

    return client
      .block()
      .then(() => client.blockchain(2, 4))
      .then(() => client.blockResults(3))
      .then(() => client.commit(4))
      .then(() => client.genesis())
      .then(() => client.health())
      .then(() => client.status())
      .then(() => client.validators());
  });

  it("Can query a tx properly", () => {
    pendingWithoutTendermint();
    const client = new Client(new HttpClient(tendermintUrl), v0_20);

    const verifyTxResponses = async () => {
      const tx = Encoding.asAscii("find=me");
      const txRes = await client.broadcastTxCommit({ tx });
      expect(responses.txCommitSuccess(txRes)).toBeTruthy();
      expect(txRes.height).toBeTruthy();
      const height: number = txRes.height || 0; // || 0 for type system
      expect(txRes.hash.length).not.toEqual(0);
      const hash = txRes.hash;

      // find by hash - does it match?
      const r = await client.tx({ hash, prove: true });
      // both values come from rpc, so same type (Buffer/Uint8Array)
      expect(r.hash).toEqual(hash);
      // force the type when comparing to locally generated value
      expect(new Uint8Array(r.tx)).toEqual(tx);
      expect(r.height).toEqual(height);
      expect(r.proof).toBeTruthy();

      // txSearch - you must enable the indexer when running
      // tendermint, else you get empty results
      const query = "app.key='find'" as QueryString;
      const s = await client.txSearch({ query, page: 1, per_page: 30 });
      // should find the tx
      expect(s.totalCount).toEqual(1);
      expect(s.txs.length).toEqual(1);
      // should return same info as querying directly,
      // except without the proof
      expect(s.txs[0]).toEqual({ ...r, proof: undefined });
    };

    return verifyTxResponses().catch(err => fail(err));
  });
});