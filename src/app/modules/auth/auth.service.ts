import bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { sendEmail } from "./sendEmail";
import prisma from "../../../shared/prisma";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // If user does not exist or password is incorrect
  const isUserExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }
  // Check if user exists and password is correct
  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "password mismatch");
  }

  // If user exists and password is correct, return the user object with the token and refresh token

  const { email: userEmail, role } = isUserExist;
  // TODO: generate token and refresh token here
  const accessToken = jwtHelpers.createToken(
    { userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // refresh token
  const refreshToken = jwtHelpers.createToken(
    { userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    // needsPasswordChange,
  };
};

// const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
//   //verify token
//   // invalid token
//   let verifiedToken = null;
//   try {
//     verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
//   } catch (err) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
//   }

//   // checking deleted user's refresh token
//   const { userId } = verifiedToken;
//   const isUserExist = await User.isUserExist(userId);
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
//   }

//   // generate new token and refresh token

//   const newAccessToken = jwtHelpers.createToken(
//     {
//       id: isUserExist.id,
//       role: isUserExist.role,
//     },
//     config.jwt.secret as Secret,
//     config.jwt.expires_in as string
//   );
//   // return new tokens
//   return {
//     accessToken: newAccessToken,
//   };
// };

// const changePassword = async (
//   user: JwtPayload | null,
//   payload: IChangePassword
// ): Promise<void> => {
//   const { oldPassword, newPassword } = payload;

//   // // checking is user exist
//   // const isUserExist = await User.isUserExist({id: user?.userId});

//   //alternative way
//   const isUserExist = await User.findOne({ id: user?.userId }).select(
//     "+password"
//   );

//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
//   }

//   // check old password matching
//   if (
//     isUserExist.password &&
//     !(await User.isPasswordMatched(oldPassword, isUserExist.password))
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
//   }

//   isUserExist.password = newPassword;
//   isUserExist.needsPasswordChange = true;
//   // updating using save()
//   isUserExist.save();
// };

// const forgotPassword = async (payload: { id: string }) => {
//   const user = await User.findOne({ id: payload.id }, { id: 1, role: 1 });

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User Not Found!");
//   }

//   let profile = null;

//   if (user.role === ENUM_USER_ROLE.ADMIN) {
//     profile = await Admin.findOne({ adminId: user.id });
//   } else if (user.role === ENUM_USER_ROLE.TEACHER) {
//     profile = await Teacher.findOne({ teacherId: user.id });
//   } else if (user.role === ENUM_USER_ROLE.STUDENT) {
//     profile = await Student.findOne({ studentId: user.id });
//   }
//   if (!profile) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Profile Not Found!");
//   }
//   if (!profile.email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User email is not found!");
//   }

//   const passResetToken = await jwtHelpers.resetToken(
//     { id: user.id },
//     config.jwt.secret as string,
//     "50m"
//   );

//   const resetLink: string = config.resetlink + `token="${passResetToken}"`;
//   await sendEmail(
//     profile.email,
//     `
//     <div>
//       <p>Hi, ${profile.name.firstName}</p>
//       <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
//       <p>Thank you</p>
//     </div>
// `
//   );
// };

// const resetPassword = async (
//   payload: { id: string; newPassword: string },
//   token: string
// ) => {
//   const { id, newPassword } = payload;

//   const user = await User.findOne({ id }, { id: 1 });

//   if (!user) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found!");
//   }
//   const isVarified = await jwtHelpers.verifyToken(
//     token,
//     config.jwt.secret as string
//   );

//   const password = await bcrypt.hash(
//     newPassword,
//     Number(config.bycrypt_salt_rounds)
//   );

//   await User.updateOne({ id }, { password });
// };

export const AuthService = {
  loginUser,
  // refreshToken,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
