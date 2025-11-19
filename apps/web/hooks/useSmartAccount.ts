import { useCallback, useEffect, useState } from "react"
import { createPublicClient, hashMessage, http, PublicClient } from "viem"
import { BundlerClient, createBundlerClient, createWebAuthnCredential, SmartAccount, toWebAuthnAccount } from "viem/account-abstraction"
import { ICredential, useCredentialStore } from "../stores/useCredentialStore"
import { baseSepolia } from "viem/chains"
import { toAbstractionSmartAccount } from "@abstraction/onchain"

type Config = {
  account: SmartAccount,
  client: PublicClient,
  bundlerClient: BundlerClient
}

const initConfig = async (credential: ICredential): Promise<Config> => {
  const account = toWebAuthnAccount({
    credential,
  })

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http()
  }) as PublicClient
  const abstractionSmartAccount = await toAbstractionSmartAccount({
    client,
    signer: account,
    keyId: hashMessage(credential.id),
  })

  const bundlerClient = createBundlerClient({
    account: abstractionSmartAccount,
    client,
    transport: http("https://api.pimlico.io/v2/84532/rpc?apikey=pim_KgKHUUmYG8V1JBtiyWkAGN"),
  })

  return {
    account: abstractionSmartAccount,
    client,
    bundlerClient
  }
}

const useSmartAccount = () => {
  const { credential, loading, setCredential } = useCredentialStore()
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    if (!loading && credential) {
      initConfig(credential).then((cfg) => {
        setConfig(cfg)
      })
    }
  }, [loading, credential])

  const createSmartAccount = useCallback(async (name: string) => {
    const cred: ICredential = await createWebAuthnCredential({
      name
    })
    setCredential(cred)
    const cfg = await initConfig(cred)
    setConfig(cfg)
  }, [setCredential])

  return {
    loading,
    config,
    createSmartAccount
  }
}
export default useSmartAccount

