import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCustomerDto: CreateCustomerDto) {
    return await this.FindOrCreateCustomer(createCustomerDto);
  }

  private async FindOrCreateCustomer(createCustomerDto: CreateCustomerDto) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        full_name: createCustomerDto.full_name,
      },
    });

    if (customer) {
      const address = await this.prisma.addres.findFirst({
        where: {
          customer_id: customer.id,
        },
      });

      const number_phone = await this.prisma.number_Phone.findFirst({
        where: {
          customer_id: customer.id,
        },
      });

      if (address == null) {
        await this.prisma.addres.createMany({
          data: [
            {
              address: createCustomerDto.address,
              customer_id: customer.id,
            },
          ],
        });
      }
      if (number_phone == null) {
        await this.prisma.number_Phone.createMany({
          data: [
            {
              number_phone: createCustomerDto.number_phone,
              customer_id: customer.id,
            },
          ],
        });
      }
    }
    else {
      const customer = await this.prisma.customer.create({
        data: {
          full_name: createCustomerDto.full_name,
          Addres: {
            create: [
              {
                address: createCustomerDto.address,
              },
            ],
          },
          Number_Phone: {
            create: [
              {
                number_phone: createCustomerDto.number_phone,
              },
            ],
          },
        },
        include: {
          Addres: true,
          Number_Phone: true,
        }
      });

      return customer;
    }
  }

  findAll() {
    return this.prisma.customer.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        Addres: true,
        Number_Phone: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return this.prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
