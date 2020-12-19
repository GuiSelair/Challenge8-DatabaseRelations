import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productIDs = products.map(product => product.id);

    const productsFound = await this.ormRepository.find({
      where: {
        id: In(productIDs),
      },
    });
    return productsFound;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<void> {
    // const productsUpdated = products.map(findProduct => {
    //   const [productToUpdate] = await this.ormRepository.find({
    //     id: findProduct.id,
    //   });
    //   if (productToUpdate) {
    //     productToUpdate.quantity = findProduct.quantity;
    //     await this.ormRepository.save(productToUpdate);
    //   }
    //   return productToUpdate;
    // });
    // return productsUpdated;
  }
}

export default ProductsRepository;
