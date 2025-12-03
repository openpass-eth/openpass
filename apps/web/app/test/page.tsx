"use client"
import { implement, serializePublicKey, toAbstractionSmartAccount } from "@openpass/onchain";
import { getChain, parsePublicKey } from "@openpass/utils";
import { NextPage } from "next";
import { WebAuthnP256, P256, Signature } from "ox";
import { createPublicClient, http, encodeAbiParameters, keccak256, toHex, encodeFunctionData } from "viem";
import { createWebAuthnCredential, toWebAuthnAccount } from "viem/account-abstraction";
import { mnemonicToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { hashMessage } from "viem/utils";

const seedsTest = "veteran shuffle music second spice milk come vocal allow furnace consider nerve"

const TestPage: NextPage = () => {
  const createAccount = async () => {
    const account = mnemonicToAccount(seedsTest)
    console.log("Account Address:", account.address)
    const credential = await createWebAuthnCredential({
      name: "test wallet",
    })
    const signer = toWebAuthnAccount({
      credential,
    })

    const key = parsePublicKey(signer.publicKey)

    const signingKeys = [{
      x: key.x,
      y: key.y,
    }]

    // Encode SigningKey[]
    const encodedSigningKeys = encodeAbiParameters(
      [
        {
          components: [
            { name: "x", type: "uint256" },
            { name: "y", type: "uint256" },
          ],
          name: "keys",
          type: "tuple[]",
        },
      ],
      [signingKeys]
    )
    const signers = encodedSigningKeys

    const nonce = 1n // Initial nonce
    const SET_SIGNING_KEY_TYPEHASH = keccak256(toHex("SetSigningKey(bytes signers,uint256 nonce)"))
    const structHash = keccak256(
      encodeAbiParameters(
        [
          { name: "typeHash", type: "bytes32" },
          { name: "signersHash", type: "bytes32" },
          { name: "nonce", type: "uint256" },
        ],
        [
          SET_SIGNING_KEY_TYPEHASH,
          keccak256(signers),
          nonce,
        ]
      )
    )

    const signature = await account.sign({
      hash: structHash,
    })

    console.log("Signers", signers)
    console.log("Address", account.address)
    console.log("Owner Signature:", signature)

    const setSigningKeyAbi = [
      {
        name: "setSigningKey",
        type: "function",
        inputs: [
          { name: "signers", type: "bytes" },
          { name: "nonce", type: "uint256" },
          { name: "ownerSignature", type: "bytes" },
        ],
        outputs: [],
        stateMutability: "public",
      },
    ] as const

    const initData = encodeFunctionData({
      abi: setSigningKeyAbi,
      functionName: "setSigningKey",
      args: [signers, nonce, signature],
    })

    localStorage.setItem("initData", initData);
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http()
    })

    console.log("Init Data:", initData)
    const estimate = await client.estimateGas({
      to: implement,
      data: initData,
    })

    console.log("Estimate:", estimate)

    const smartAccount = await toAbstractionSmartAccount({
      client: client as any,
      signer: signer as any,
      address: account.address,
      initialData: initData, // Passing it here if supported
    })
    console.log("Smart Account:", smartAccount)
  }

  return (
    <div>
      <h1>Test Page</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={createAccount}>Create Account</button>
    </div>
  )
}

export default TestPage
