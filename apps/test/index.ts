import { mnemonicToAccount, type Address } from "viem/accounts"

const implmementAddress: Address = "0x946231Aec9e0dCcF4d7952e8Cb40D9F2fE042f31"

const main = async () => {
  const seeds = process.env.SEEDS || ""
  const account = mnemonicToAccount(seeds)

  console.log(account.address)
}

main()
