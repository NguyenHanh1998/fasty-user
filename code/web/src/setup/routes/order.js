import ConfirmPayment from '../../modules/orders/ConfirmPayment';

export default {
  confirmPayment: {
    path: '/confirm-payment',
    component: ConfirmPayment,
    auth: true
  }
}