import { bytesToHex, concat, encodeAbiParameters, encodeFunctionData, encodePacked, getContractAddress, hexToBytes, keccak256, zeroAddress, type Address, type Assign, type Hex, type Prettify, type PublicClient } from "viem";
import FactoryAbi from "./Factory.abi.json";
import WalletAbi from "./Wallet.abi.json";
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import { entryPoint08Abi, entryPoint08Address, getUserOperationHash, toSmartAccount, type SmartAccount, type SmartAccountImplementation, type WebAuthnAccount } from "viem/account-abstraction";
import { Signature } from "ox";
import { numberToBytesBE } from "@noble/curves/utils.js";
import { getFactoryAddress } from "@openpass/utils";

export const accountInitCodeHash: Hex = "0xceb9daa00a2c3992e663e03258dbdb5117cc1e35cff5afbc6b919bd0ba9fa45c"

export const implement: Address = "0x2D95FE5cEd64b4fa3c422e45b7b184495f922564"

export type ToAbstractionAccountParameters = {
  address: Address,
  initialData?: Hex,
  client: AbstractionSmartAccountImplementation['client'],
  signer: WebAuthnAccount,
  signerIndex?: number,
}

export type ToAbstractionSmartAccountReturnType = Prettify<
  SmartAccount<AbstractionSmartAccountImplementation>
>

export type PublicKey = {
  prefix?: number
  x: bigint
  y: bigint
}


export type AbstractionSmartAccountImplementation = Assign<
  SmartAccountImplementation<
    typeof entryPoint08Abi,
    '0.8',
    { abi: typeof WalletAbi; factory: { abi: typeof FactoryAbi; address: Address } }
  >,
  {
    decodeCalls: NonNullable<SmartAccountImplementation['decodeCalls']>
    sign: NonNullable<SmartAccountImplementation['sign']>
  }
>

export const toAbstractionSmartAccount = async (params: ToAbstractionAccountParameters): Promise<ToAbstractionSmartAccountReturnType> => {
  const { client, signer, address, initialData, signerIndex } = params
  const entryPoint = {
    abi: entryPoint08Abi,
    address: entryPoint08Address,
    version: '0.8',
  } as const;

  return toSmartAccount({
    client,
    entryPoint,
    extend: {
      abi: WalletAbi,
      factory: {
        address: getFactoryAddress(),
        abi: FactoryAbi,
      }
    },
    async encodeCalls(calls) {
      return encodeFunctionData({
        abi: WalletAbi,
        functionName: 'executeBatch',
        args: [calls.map(call => {
          return [call.to, call.value || 0n, call.data || "0x"]
        })],
      })
    },
    async getAddress() {
      return address;
    },
    async getFactoryArgs() {
      return {
        factory: "0x7702",
        factoryData: initialData || "0x"
      }
    },
    async getStubSignature() {
      return "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001949fc7c88032b9fcb5f6efc7a7b8c63668eae9871b765e23123bb473ff57aa831a7c0d9276168ebcc29f2875a0239cffdf2a9cd1c2007c5c77c071db9264df1d000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008a7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2273496a396e6164474850596759334b7156384f7a4a666c726275504b474f716d59576f4d57516869467773222c226f726967696e223a2268747470733a2f2f7369676e2e636f696e626173652e636f6d222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000"
    },
    async signTypedData(params) {
      const { signature, webauthn } = await signer.signTypedData(params)
      return toWebAuthnSignature(signature, webauthn, signerIndex)
    },
    async signUserOperation(params) {
      const { chainId = client.chain!.id, ...userOperation } = params
      const address = await this.getAddress()
      const userOpHash = getUserOperationHash({
        chainId,
        entryPointAddress: entryPoint.address,
        entryPointVersion: entryPoint.version,
        userOperation: {
          ...(userOperation as any),
          sender: address,
        },
      })

      const { signature, webauthn } = await signer.sign({ hash: userOpHash })
      return toWebAuthnSignature(signature, webauthn, signerIndex)
    },
    async signMessage(params) {
      const { signature, webauthn } = await signer.signMessage(params)
      return toWebAuthnSignature(signature, webauthn, signerIndex)
    },
    userOperation: {
      async estimateGas(userOperation) {
        // Accounts with WebAuthn owner require a minimum verification gas limit of 800,000.
        return {
          verificationGasLimit: BigInt(
            Math.max(Number(userOperation.verificationGasLimit ?? 0n), 1_000_000),
          ),
        }
      },
    }
  }) as unknown as ToAbstractionSmartAccountReturnType
}

const WebAuthnAuth = [
  {
    components: [
      {
        name: "authenticatorData",
        type: "bytes",
      },
      {
        name: "clientDataJSON",
        type: "string",
      },
      {
        name: "challengeIndex",
        type: "uint256",
      },
      {
        name: "typeIndex",
        type: "uint256",
      },
      {
        name: "r",
        type: "uint256",
      },
      {
        name: "s",
        type: "uint256",
      },
    ],
    name: "webAuthnAuth",
    type: "tuple",
  },
];

export const toWebAuthnSignature = (signature: Hex, webauthn: WebAuthnP256.SignMetadata, index: number = 0): Hex => {
  const { r, s } = Signature.fromHex(signature)
  const res = encodeAbiParameters(WebAuthnAuth, [
    {
      authenticatorData: webauthn.authenticatorData,
      clientDataJSON: webauthn.clientDataJSON,
      challengeIndex: BigInt(webauthn.challengeIndex ?? 0),
      typeIndex: BigInt(webauthn.typeIndex ?? 0),
      r,
      s
    },
  ]);

  return encodeAbiParameters(
    [
      {
        components: [
          {
            name: 'index',
            type: 'uint8',
          },
          {
            name: 'signature',
            type: 'bytes',
          },
        ],
        type: 'tuple',
      },
    ],
    [
      {
        index,
        signature: res,
      },
    ],
  )
}

export const parsePublicKey = (publicKey: Hex | Uint8Array): PublicKey => {
  const bytes =
    typeof publicKey === 'string' ? hexToBytes(publicKey) : publicKey
  const offset = bytes.length === 65 ? 1 : 0
  const x = bytes.slice(offset, 32 + offset)
  const y = bytes.slice(32 + offset, 64 + offset)
  return {
    prefix: bytes.length === 65 ? bytes[0] : undefined,
    x: BigInt(bytesToHex(x)),
    y: BigInt(bytesToHex(y)),
  }
}

export type SerializePublicKeyOptions<to extends 'hex' | 'bytes' = 'hex'> = {
  compressed?: boolean | undefined
  to?: to | 'bytes' | 'hex' | undefined
}

/**
 * Serializes a public key into a hex string or bytes.
 */
export function serializePublicKey<to extends 'hex' | 'bytes' = 'hex'>(
  publicKey: PublicKey,
  options: SerializePublicKeyOptions<to> = {},
): to extends 'hex' ? Hex : Uint8Array {
  const { compressed = false, to = 'hex' } = options
  const result = Uint8Array.from([
    ...(publicKey.prefix && !compressed ? [publicKey.prefix] : []),
    ...numberToBytesBE(publicKey.x, 32),
    ...numberToBytesBE(publicKey.y, 32),
  ])
  return (to === 'hex' ? bytesToHex(result) : result) as any
}

export {
  FactoryAbi,
  WalletAbi,
}

