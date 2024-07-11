import { OrderProduct, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IOrderProductFilter } from "./orderProduct.interface";
import { orderProductSearchableFields } from "./orderProduct.constants";

const createOrderProduct = async (
  data: OrderProduct
): Promise<OrderProduct> => {
  const result = await prisma.orderProduct.create({
    data,
  });
  return result;
};

const getAllOrderProduct = async (
  filters: IOrderProductFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<OrderProduct[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(options);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: orderProductSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.OrderProductWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.orderProduct.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : undefined,
  });

  const total = await prisma.orderProduct.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOrderProduct = async (
  id: string
): Promise<OrderProduct | null> => {
  const result = await prisma.orderProduct.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOrderProduct = async (
  id: string,
  payload: Partial<OrderProduct>
): Promise<OrderProduct> => {
  const result = await prisma.orderProduct.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteOrderProduct = async (id: string): Promise<OrderProduct> => {
  const result = await prisma.orderProduct.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OrderProductService = {
  createOrderProduct,
  getAllOrderProduct,
  getSingleOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
};
