import { Controller, Post, Get, Put, Body, Delete, Req, HttpStatus, UseGuards, Param, Res, Request } from '@nestjs/common';

import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from 'src/strategies/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllOrders(@Req() req): Promise<any> {
        const userId = req.user.userId;
        return await this.orderService.getAllOrders(userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createOrder(@Req() req, @Res() res): Promise<any> {
        const userId = req.user.userId;
        return await this.orderService.createOrder(userId, req.body);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getOrder(@Req() req, @Res() res): Promise<any> {
        const userId = req.user.userId;
        return await this.orderService.getOrder(userId, req.params.id);
    }

    // @Put(':id')
    // @UseGuards(JwtAuthGuard)
    // async updateOrder(@Req() req, @Res() res) {
    //     return await this.orderService.updateOrder(req.params.id, req.body);
    // }

    // @Delete(':id')
    // @UseGuards(JwtAuthGuard)
    // async deleteOrder(@Req() req, @Res() res) {
    //     return await this.orderService.deleteOrder(req.params.id);
    // }



}