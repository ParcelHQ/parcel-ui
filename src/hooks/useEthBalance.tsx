import { Token, TokenAmount } from '@uniswap/sdk';
import { AddressZero } from '@ethersproject/constants';

export default function useEthBalance(
  address: string,
  library: any,
  chainId: any
) {
  async function getEthBalance() {
    const ETH = new Token(chainId, AddressZero, 18);
    let val = await library
      .getBalance(address)
      .then(
        (balance: { toString: () => string }) =>
          new TokenAmount(ETH, balance.toString())
      );
    return val;
  }

  return getEthBalance();
}
