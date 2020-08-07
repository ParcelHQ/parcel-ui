export const MAINNET_ID = 1;
export const RINKEBY_ID = 3;

export const getParcelWalletAddress = () => {
  let address = localStorage.getItem('PARCEL_WALLET_ADDRESS');
  if (address) {
    address = address.replace(/'/g, '');
    address = address.replace(/'/g, '"');
    return address;
  }
  return address;
};

export default {
  [RINKEBY_ID]: {
    parcelFactory: '0x0A8E7756Fd504761e59C7180Ae70daDD0C1ef1Cd',
    parcelWallet:
      getParcelWalletAddress() || '0xc2daeC47fbE026550c4F3f6C35d300C37b8aF361', //TODO: change this to global address when created
    massPayouts: '0x9244fB7C104c09de4D5B7D41ce151ad29c837Ce4',
    tokens: {
      DAI: '0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8',
      WETH: '0xc778417e063141139fce010982780140aa0cd5ab',
      USDC: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    sablier: '0x7ee114C3628Ca90119fC699f03665bF9dB8f5faF',
  },
};
