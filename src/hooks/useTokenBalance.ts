import useContract from './useContract';
import IERC20 from '@uniswap/v2-core/build/IERC20.json';
import { utils } from 'ethers';

export default async function useTokenBalance(token: any, address: string) {
  const contract = useContract(token?.address, IERC20.abi);
  let balanceNum;
  if (contract && address) {
    const tokenBalance = await contract.balanceOf(address);
    const balance = utils.formatEther(tokenBalance);
    balanceNum = parseFloat(balance).toFixed(2);
  }

  return balanceNum;
}
