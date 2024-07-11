import express from "express";

import { UserRoutes } from "../modules/users/user.route";

import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { OrderRoutes } from "../modules/order/order.route";
import { OrderProductRoutes } from "../modules/orderProduct/orderProduct.route";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/users",
    module: UserRoutes,
  },
  {
    path: "/auth",
    module: AuthRoutes,
  },
  {
    path: "/categories",
    module: CategoryRoutes,
  },
  {
    path: "/products",
    module: ProductRoutes,
  },
  {
    path: "/orders",
    module: OrderRoutes,
  },
  {
    path: "/order-products",
    module: OrderProductRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
