import { Prisma, Product } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IProductFilter } from "./product.interface";
import { ProductSearchableFields } from "./product.constants";

const createProduct = async (data: Product): Promise<Product> => {
  const result = await prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
  return result;
};

const getAllProduct = async (
  filters: IProductFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(options);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: ProductSearchableFields.map((field) => ({
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

  const whereConditons: Prisma.ProductWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.product.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.product.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleProduct = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<Product>
): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteProduct = async (id: string): Promise<Product> => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ProductService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
