import ImportWallet from '../../modules/wallets/ImportWallet';
import MyWalletsList from '../../modules/wallets/MyWalletsList';

export default {
  walletList: {
    path: '/my-wallets',
    component: MyWalletsList,
    auth: true
  },
  importWallet: {
    path: '/import-wallet',
    component: ImportWallet,
    auth: true
  }
}