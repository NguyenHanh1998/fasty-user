import ConfirmPayment from '../../modules/orders/ConfirmPayment';
import ProcessPayment from '../../modules/orders/ProcessPayment';

export default {
  confirmPayment: {
    path: '/confirm-payment',
    component: ConfirmPayment,
    auth: true
  },
  processPayment: {
    path: '/process-payment',
    component: ProcessPayment,
    auth: true
  }
}