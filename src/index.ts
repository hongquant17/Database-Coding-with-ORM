import express from 'express';

const app = express();
const port = 3307;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// results at http://localhost:${port}/customerWithOrders
app.get('/customersWithOrders', async (req, res) => {
  const customers = await prisma.customers.findMany();
  const customersWithOrders = await Promise.all(customers.map(async (customer) => {
    const orders = await prisma.orders.findMany({
      where: {
        customerNumber: customer.customerNumber,
      },
      select: {
        orderNumber: true,
        orderDate: true,
        requiredDate: true,
        shippedDate: true,
        status: true
      }
    });
    return { 
      customerNumber: customer.customerNumber,
      customerName: customer.customerName,
      orders: orders,
    };
  }));
  res.json(customersWithOrders);
});

// import cors from 'cors';

// app.use(cors());