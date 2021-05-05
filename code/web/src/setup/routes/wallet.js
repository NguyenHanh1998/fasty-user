import ImportWallet from '../../modules/wallets/ImportWallet';
import MyWalletsList from '../../modules/wallets/MyWalletsList';
import TransactionHistory from '../../modules/wallets/TransactionHistory';

export default {
  walletList: {
    path: '/my-wallet/details',
    component: MyWalletsList,
    auth: true
  },
  importWallet: {
    path: '/import-wallet',
    component: ImportWallet,
    auth: true
  },
  history: {
    path: '/my-wallet/history',
    component: TransactionHistory,
    auth: true
  }
}