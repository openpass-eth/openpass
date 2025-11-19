"use client"
import { NextPage } from "next";
import useSmartAccount from "../hooks/useSmartAccount";

const hash = "0x15773c82691639542e51fbacdfd2ee06cfd065b9ee9934fe7c3f5636e192690c"

const MainPage: NextPage = () => {
  const { loading } = useSmartAccount()
  const testViem = async () => {
  }

  return (
    <div>
      <h1>Main Page</h1>
      <button onClick={testViem}>Test Viem</button>
    </div>
  )
}

export default MainPage;
