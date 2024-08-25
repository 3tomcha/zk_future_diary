import { defaultAbiCoder } from "@ethersproject/abi"

export const decode = <T>(type: string, encodedString: string): T => {
  return defaultAbiCoder.decode([type], encodedString)[0]
}
