import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentCompletedEvent } from '../events/payment-completed.event';
import { TransactionBackup } from '../entities/transaction-backup.entity';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    @InjectRepository(TransactionBackup)
    private readonly backupRepository: Repository<TransactionBackup>,
  ) {}

  @OnEvent('payment.completed', { async: true })
  async handlePaymentCompleted(event: PaymentCompletedEvent) {
    try {
      this.logger.log(`[Backup Job] Starting backup for reff: ${event.order.reff}`);

      const backup = this.backupRepository.create({
        reff: event.order.reff,
        amount: event.order.amount,
        name: event.order.name,
        code: event.order.code,
        status: event.order.status,
        paid_at: event.order.paid_at,
      });

      await this.backupRepository.save(backup);

      this.logger.log(`[Backup Job] Successfully saved backup for reff: ${event.order.reff}`);
    } catch (error) {
      this.logger.error(
        `[Backup Job] Failed to backup for reff: ${event.order.reff}`,
        // error.stack,
      );
    }
  }
}