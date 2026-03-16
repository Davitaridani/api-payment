import { PaymentOrder } from '../entities/payment-order.entity';

export class PaymentCompletedEvent {
  constructor(public readonly order: PaymentOrder) {}
}
