import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

import pick from "../../../shared/pick";
import { OrderProductService } from "./orderProduct.service";
import { orderProductFilterableFields } from "./orderProduct.constants";

const createOrderProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderProductService.createOrderProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "create order Product created successfully",
    data: result,
  });
});

const getAllOrderProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderProductFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await OrderProductService.getAllOrderProduct(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order products gets successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleOrderProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderProductService.getSingleOrderProduct(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get single ordered product successfully!",
      data: result,
    });
  }
);

const updateOrderProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OrderProductService.updateOrderProduct(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update order product successfully",
    data: result,
  });
});

const deleteOrderProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderProductService.deleteOrderProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "order product deleted successfully",
    data: result,
  });
});

export const OrderProductController = {
  createOrderProduct,
  getAllOrderProduct,
  getSingleOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
};
