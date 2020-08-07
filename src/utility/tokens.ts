import { useMemo } from 'react';
import { ChainId, WETH, Token } from '@uniswap/sdk';

export const DEFAULT_TOKENS = [
  ...Object.values(WETH),

  new Token(
    ChainId.RINKEBY,
    '0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  new Token(
    ChainId.RINKEBY,
    '0x472d88e5246d9bF2AB925615fc580336430679Ae',
    6,
    'USDC',
    'Usdc Stablecoin'
  ),
];

export function useTokens() {
  return [
    useMemo(() => {
      return DEFAULT_TOKENS;
    }, []),
  ];
}
