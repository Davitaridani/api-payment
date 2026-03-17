import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentCompletedEvent } from './events/payment-completed.event';

const FEE = 2500;
const CODE_PREFIX = '8834';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentOrder)
    private readonly orderRepository: Repository<PaymentOrder>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrder(params: {
    amount: string;
    reff: string;
    expired: string;
    name: string;
    hp: string;
  }) {
    const { amount, reff, expired, name, hp } = params;

    // Validasi field wajib
    if (!reff || !name || !hp) {
      throw new BadRequestException('reff, name, dan hp wajib diisi');
    }

    // Validasi amount positif
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      throw new BadRequestException('Amount harus berupa angka positif');
    }

    // Validasi format expired: yyyy-MM-ddTHH:mm:ss+HH:mm
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
    if (!isoRegex.test(expired)) {
      throw new BadRequestException(
        'Format expired tidak valid. Gunakan format: yyyy-MM-ddTHH:mm:ss+HH:mm',
      );
    }

    const expiredDate = new Date(expired);
    if (isNaN(expiredDate.getTime()) || expiredDate <= new Date()) {
      throw new BadRequestException('Expired harus tanggal di masa depan');
    }

    const resultedAmount = numAmount + FEE;
    const code = `${CODE_PREFIX}${hp}`;

    const order = this.orderRepository.create({
      reff,
      amount: resultedAmount,
      expired,
      name,
      hp,
      code,
      status: 'pending',
    });

    await this.orderRepository.save(order);

    return {
      amount: String(order.amount),
      reff: order.reff,
      expired: order.expired,
      name: order.name,
      code: order.code,
    };
  }

  async processPayment(reff: string) {
    // if (!reff) {
    //   throw new ForbiddenException('reff wajib diisi');
    // }

    const order = await this.orderRepository.findOne({ where: { reff } });

    if (!order) {
      throw new ForbiddenException('reff tidak ditemukan');
    }

    if (order.status === 'paid') {
      throw new ForbiddenException('Pembayaran sudah pernah dilakukan');
    }

    const expiredDate = new Date(order.expired);
    if (expiredDate <= new Date()) {
      order.status = 'expired';
      await this.orderRepository.save(order);

      return {
        amount: String(order.amount),
        reff: order.reff,
        name: order.name,
        code: order.code,
        status: 'expired',
      };
    }

    order.status = 'paid';
    order.paid_at = new Date();
    await this.orderRepository.save(order);

    this.eventEmitter.emit(
      'payment.completed',
      new PaymentCompletedEvent(order),
    );

    return {
      amount: String(order.amount),
      reff: order.reff,
      name: order.name,
      code: order.code,
      status: 'paid',
    };
  }

  async checkStatus(reff: string) {
    // if (!reff) {
    //   throw new ForbiddenException('reff wajib diisi');
    // }

    const order = await this.orderRepository.findOne({ where: { reff } });

    if (!order) {
      throw new ForbiddenException('Order tidak ditemukan');
    }

    return {
      amount: String(order.amount),
      reff: order.reff,
      name: order.name,
      expired: order.expired,
      paid: order.paid_at ? order.paid_at.toISOString() : null,
      code: order.code,
      status: order.status,
    };
  }
}
