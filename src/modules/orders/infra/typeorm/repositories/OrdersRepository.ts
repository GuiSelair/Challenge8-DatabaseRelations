import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepositoryOrders: Repository<Order>;

  private ormRepositoryOrdersProducts: Repository<OrdersProducts>;

  constructor() {
    this.ormRepositoryOrders = getRepository(Order);
    this.ormRepositoryOrdersProducts = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const newOrder = this.ormRepositoryOrders.create({
      customer,
    });
    await this.ormRepositoryOrders.save(newOrder);

    const newOrderProducts = products.map(product => {
      return this.ormRepositoryOrdersProducts.create({
        order_id: newOrder.id,
        product_id: product.product_id,
        price: product.price,
        quantity: product.quantity,
      });
    });

    await this.ormRepositoryOrdersProducts.save(newOrderProducts);

    return newOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepositoryOrders.findOne(id);
    return order;
  }
}

export default OrdersRepository;
