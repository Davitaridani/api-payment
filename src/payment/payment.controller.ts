import {
  Controller,
  Get,
  Headers,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('order')
  createOrder(
    @Headers('x-sec-token') secToken: string,
    @Query('amount') amount: string,
    @Query('reff') reff: string,
    @Query('expired') expired: string,
    @Query('name') name: string,
    @Query('hp') hp: string,
  ) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    if (secToken !== today)
      throw new UnauthorizedException('Invalid Sec-Token');

    return this.paymentService.createOrder({ amount, reff, expired, name, hp });
  }

  @Get('payment')
  processPayment(
    @Headers('x-sec-token') secToken: string,

    @Query('reff') reff: string,
  ) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    if (secToken !== today)
      throw new UnauthorizedException('Invalid Sec-Token');

    return this.paymentService.processPayment(reff);
  }

  @Get('status')
  checkStatus(
    @Query('reff') reff: string,
    @Headers('x-sec-token') secToken: string,
  ) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    if (secToken !== today)
      throw new UnauthorizedException('Invalid Sec-Token');

    return this.paymentService.checkStatus(reff);
  }
}
