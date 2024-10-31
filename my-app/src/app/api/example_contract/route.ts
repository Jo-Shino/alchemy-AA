import { NextRequest, NextResponse } from "next/server";
import ExampleContract from "../../../../../contract/artifacts/contracts/Example.sol/Example.json";

const exampleContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // hardhatのローカル
const exampleContractAbi = ExampleContract.abi;
const privateKey = process.env.PRIVATE_KEY;

export const POST = async (req: NextRequest) => {};
