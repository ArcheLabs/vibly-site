# Vibly Agent Onboarding Runbook

This file is written for local coding agents such as Codex, Claude, or other terminal automation tools. Follow it exactly and do not ask for, read, print, or store the user's root wallet private key or seed phrase.

## Goal

Set up this machine as a Vibly Agent for the currently open Vibly network. The local client only creates and stores an Agent session key. The human user controls identity, staking, pause/resume, and unbonding from Vibly Console with their root wallet.

As of 2026-06-02, Polkadot to VIB conversion is available through Console, but VIB claim and Agent onboarding for the incentivized testnet are not live until the incentivized testnet launches.

## Safety Rules

- Never request the root wallet seed phrase, private key, browser wallet password, or hardware-wallet secret.
- Never run staking, identity, or root-management transactions from this machine unless the user explicitly provides a development signer for a local testnet.
- Treat the session public key and `enrollment.json` as public-ish local agent metadata. Treat the session secret as private local key material.
- If identity, chain agent registration, active stake, or Console authorization is missing, stop and tell the user to finish the Console step.

## Automated Local Setup

1. Verify Node.js 20 or newer is available.

```bash
node --version
```

2. Check the Vibly client package without contacting a coordinator.

```bash
npx @vibly-ai/client@latest doctor --offline
```

3. Refresh the public network manifest.

```bash
npx @vibly-ai/client@latest network refresh --network substrate:vibly-incentivized-testnet
```

If this says the network is `prelaunch`, stop before daemon setup and tell the user that Agent onboarding opens after incentivized testnet launch. The user may still use Console for Polkadot to VIB conversion, but cannot claim VIB to the incentivized testnet yet.

4. Generate a local Agent session key and enrollment descriptor.

```bash
npx @vibly-ai/client@latest agent init --name "$(hostname)-vibly-agent"
```

5. Record these values from the output:

- `localAgentId`
- `sessionPublicKey`
- `Enrollment file`
- `Session secret`
- `Console add-agent URL`

Do not print the session secret contents. The Console URL contains only public fields such as `sessionPublicKey`, `localAgentId`, and display name. It never contains the session secret.

## Human Console Step

Ask the user to open the `Console add-agent URL` printed by `agent init`. It should look like:

```text
https://console.vibly.network/personal-center/add-agent#sessionPublicKey=<sessionPublicKey>&localAgentId=<localAgentId>
```

The user should:

1. Connect the root wallet.
2. Make sure the wallet has VIB on Vibly testnet.
3. Register or link the root identity if needed.
4. Confirm the prefilled Agent session public key.
5. Authorize the session public key under the connected root identity.
6. Complete chain agent registration and active staking in Console when those actions are available.

## Finish On This Machine

After the user authorizes the session public key in Console, complete enrollment from this machine:

```bash
npx @vibly-ai/client@latest agent wait-link --local-agent-id <localAgentId>
```

`wait-link` polls the coordinator for the root authorization, signs the completion message with the local session key, submits the public enrollment descriptor, and stores the returned minimal runtime token locally.

Then check readiness:

```bash
npx @vibly-ai/client@latest agent status --organization <organizationId>
```

Only start the daemon if status shows Console authorization, chain agent registration, and active stake are ready.

```bash
npx @vibly-ai/client@latest daemon start
```

## Manual Fallback

If the Console URL does not prefill the key, open `https://console.vibly.network/personal-center`, choose Add Agent, and enter the `sessionPublicKey` printed by `agent init`.

If `wait-link` times out, do not guess identifiers or ask for wallet secrets. Ask the user to confirm that the root wallet authorized the same `sessionPublicKey` shown by `agent init`, then run `wait-link` again.

If staking is not complete, tell the user: "Your local Agent is ready, but root wallet staking is still required in Console before this daemon can work."
