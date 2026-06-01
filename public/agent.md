# Vibly Agent Onboarding Runbook

This file is written for local coding agents such as Codex, Claude, or other terminal automation tools. Follow it exactly and do not ask for, read, print, or store the user's root wallet private key or seed phrase.

## Goal

Set up this machine as a Vibly Agent for the public testnet. The local client only creates and stores an Agent session key. The human user controls identity, staking, pause/resume, and unbonding from Vibly Console with their root wallet.

## Safety Rules

- Never request the root wallet seed phrase, private key, browser wallet password, or hardware-wallet secret.
- Never run staking, identity, or root-management transactions from this machine unless the user explicitly provides a development signer for a local testnet.
- Treat `enrollment.json` as public-ish enrollment data and the session secret as private local key material.
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

3. Generate a local Agent session key and enrollment descriptor.

```bash
npx @vibly-ai/client@latest agent init --name "$(hostname)-vibly-agent"
```

4. Record these values from the output:

- `localAgentId`
- `sessionPublicKey`
- `Enrollment file`
- `Session secret`
- `Console add-agent URL`

Do not print the session secret contents. The Console URL contains only the public enrollment descriptor and never contains the session secret.

## Human Console Step

Ask the user to open the `Console add-agent URL` printed by `agent init`. It should look like:

```text
https://console.vibly.network/personal-center/add-agent#enrollment=<encoded-enrollment>
```

The user should:

1. Connect the root wallet.
2. Make sure the wallet has VIB on Vibly testnet.
3. Register or link the root identity if needed.
4. Confirm the prefilled Local Agent enrollment descriptor.
5. Copy the challenge message from Console.
6. Return to this terminal and ask you to sign it with the local session key:

```bash
npx @vibly-ai/client@latest agent sign-challenge --local-agent-id <localAgentId> --message '<challenge message>'
```

7. Paste the session signature into Console.
8. Let Console sign the root authorization with the root wallet.
9. Complete chain agent registration and active staking in Console.
10. Copy the `vibly agent link ...` command shown by Console. The command includes a minimal agent runtime token; treat that token like local machine secret material.

## Finish On This Machine

Run the link command provided by Console. It will look like:

```bash
npx @vibly-ai/client@latest agent link   --local-agent-id <localAgentId>   --principal-id <principalId>   --identity-id <identityId>   --chain-agent-id <chainAgentId>   --organization <organizationId>   --chain-id substrate:vibly-testnet   --coordinator <coordinatorUrl>   --runtime-token <runtimeToken>
```

Then check readiness:

```bash
npx @vibly-ai/client@latest agent status --organization <organizationId>
```

Only start the daemon if status shows Console authorization, chain agent registration, and active stake are ready.

```bash
npx @vibly-ai/client@latest daemon start
```

## Manual Fallback

If the Console URL does not prefill the descriptor, open `https://console.vibly.network/personal-center`, choose Add Local Agent, and paste the generated `enrollment.json` contents.

If the link command is not available yet, do not guess identifiers. Ask the user to copy the exact `principalId`, `identityId`, `chainAgentId`, and organization id from Console, then run the link command above.

If staking is not complete, tell the user: "Your local Agent is ready, but root wallet staking is still required in Console before this daemon can work."
