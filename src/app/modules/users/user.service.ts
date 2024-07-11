import { Prisma, User } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IUserFilter } from "./user.interface";
import { UserSearchableFields } from "./user.constants";

import bcrypt from "bcrypt";
import config from "../../../config";

const createUser = async (data: User): Promise<User> => {
  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  // Create a new data object with the hashed password
  const userData = {
    ...data,
    password: hashedPassword,
  };

  // Save the user to the database
  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const getAllUsers = async (
  filters: IUserFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(options);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: UserSearchableFields.map((field) => ({
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

  const whereConditons: Prisma.UserWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.user.findMany({
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

  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
