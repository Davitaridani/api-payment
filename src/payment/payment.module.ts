import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
// import { BackupService } from './backup/backup.service';
// import { PaymentOrder } from './entities/payment-order.entity';
import { TransactionBackup } from './entities/transaction-backup.entity';
import { PaymentOrder } from './entities/payment-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentOrder, TransactionBackup])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
