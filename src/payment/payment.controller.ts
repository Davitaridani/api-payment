// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post()
//   create(@Body() createPaymentDto: CreatePaymentDto) {
//     return this.paymentService.create(createPaymentDto);
//   }

//   @Get()
//   findAll() {
//     return this.paymentService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.paymentService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
//     return this.paymentService.update(+id, updatePaymentDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.paymentService.remove(+id);
//   }
// }

import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * GET /order?amount=100000&reff=2000837452&expired=2021-07-28T09%3A12%3A48%2B07%3A00&name=Nama+Pelanggan&hp=081854323334
   */
  @Get('order')
  createOrder(
    @Query('amount') amount: string,
    @Query('reff') reff: string,
    @Query('expired') expired: string,
    @Query('name') name: string,
    @Query('hp') hp: string,
  ) {
    return this.paymentService.createOrder({ amount, reff, expired, name, hp });
  }

  /**
   * GET /payment?reff=2000837452
   */
  @Get('payment')
  processPayment(@Query('reff') reff: string) {
    return this.paymentService.processPayment(reff);
  }

  /**
   * GET /status?reff=2000837452
   */
  @Get('status')
  checkStatus(@Query('reff') reff: string) {
    return this.paymentService.checkStatus(reff);
  }
}
