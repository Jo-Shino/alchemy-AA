// @reference: https://www.youtube.com/watch?v=7aJ5bonMSyQ

import { NextRequest, NextResponse } from "next/server";
import ExampleContract from "../../../../../contract/artifacts/contracts/Example.sol/Example.json";
import {
  LocalAccountSigner,
  type SmartAccountSigner,
  sepolia, // 依存関係のviem/chainsから読み込み
} from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { encodeFunctionData } from "viem";

export const POST = async (req: NextRequest) => {
  const exampleContractAddress = process.env.EXAMPLE_CONTRACT_ADDRESS;
  const exampleContractAbi = ExampleContract.abi;
  const privateKey = process.env.PRIVATE_KEY;
  // @notion: alchemyのAccount Kitプロジェクトを作成し、取得
  const alchemyApiKey = process.env.ALCHEMY_API_KEY!;
  // @notion: alchemyのAccount Kitプロジェクトを作成し、取得
  const policyId = process.env.ALCHEMY_POLICY_ID!;
  // @dev: privatekeyは署名の際に必要なだけなため、任意の一意な文字列であれば問題ない。
  // @dev: paymasterを設定せずsignerがガス代を払う場合はEOAの必要がある
  // 例 const privateKey = require("crypto").randomBytes(32).toString("hex"); // 一定の文字列ならOK

  // 以下シーケンス
  // signer -> bundler eoa(tranction) -> entrypoint(paymasterに問い合わせ) -> smart contract account -> contract
  const signer = LocalAccountSigner.privateKeyToAccountSigner(
    `0x${privateKey}` // ドキュメントでは0xがデフォルト
  );

  // moduler account client
  // below allow access to ERC6900 moduler accout
  const client = await createModularAccountAlchemyClient({
    apiKey: alchemyApiKey,
    chain: sepolia,
    signer,
    // @dev:paymasterの設定
    gasManagerConfig: {
      policyId: policyId,
    },
  });

  const firstValue = await client.readContract({
    abi: exampleContractAbi,
    address: `0x${exampleContractAddress}`,
    functionName: "x",
  });
  console.log(firstValue);

  const callData = encodeFunctionData({
    abi: exampleContractAbi,
    functionName: "change",
    args: [BigInt(50)],
  });

  const result = await client.sendUserOperation({
    uo: {
      target: `0x${exampleContractAddress}`,
      data: callData,
    },
  });
  const txHash = await client.waitForUserOperationTransaction(result);
  console.log(txHash);

  const x = await client.readContract({
    abi: exampleContractAbi,
    address: `0x${exampleContractAddress}`,
    functionName: "x",
  });

  console.log(x);
  return NextResponse.json({ message: x, success: false });
};
