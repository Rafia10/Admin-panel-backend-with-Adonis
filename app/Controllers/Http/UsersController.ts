import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BussinessUser from "App/Models/BussinessUser";
import hash from "@ioc:Adonis/Core/Hash";
import AccessTokenService from "App/Services/AccessToken";
import helpers from "App/Helpers";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";
import { paginate } from "mongoose-paginate-v2";
export default class UsersController {
  public async Auth({ request, response }: HttpContextContract) {
    let params = request.all();

    try {
      let user: any = await BussinessUser.findOne({
        email: params.email,
      }).select("+password");
      if (!user) {
        throw "User not found";
      }

      user = user.toJSON();

      let checkPassword = await hash.verify(user.password, params.password);

      if (!checkPassword) {
        throw "Invalid password";
      }

      let accessTokenModel = new AccessTokenService();

      user.accessToken = await accessTokenModel.createTokenForUser(user._id);

      delete user.password;

      helpers.sendSuccessMessage("Successfully logged in", user, response);
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }

  public async ForgetPassword({ request, response }: HttpContextContract) {
    // await request.validate(ForgotPasswordValidator);
    let params = request.all();
    try {
      let otp = helpers.otp();
      let user_exist = await BussinessUser.findOneAndUpdate(
        { email: params.email },
        { otp: otp },
        { new: true }
      ).catch((e) => {
        console.log(e);
      });

      if (!user_exist) {
        throw "Invalid Email. ";
      }

      await Mail.send((message) => {
        message
          .from(Env.get("SMTP_MAIL_FROM"))
          .to(params.email)
          .subject("Your OTP for resetting your password")
          .text(`Your Otp is ${otp}`);
      });
      helpers.sendSuccessMessage(
        "Forgot Password mail sent Successfully",
        user_exist,
        response
      );
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    let params = request.all();
    try {
      let existingUser = await BussinessUser.findOne({
        email: params.email,
        otp: params.otp,
      });
      if (!params.email && !params.otp) {
        throw "Email and OTP are required fields";
      }
      if (!existingUser) {
        throw "Invalid Email or otp.";
      }
      let user = await BussinessUser.updateOne(
        { otp: existingUser?.otp },
        {
          $set: {
            password: await hash.make(params.password),
            otp: null,
          },
        }
      );

      helpers.sendSuccessMessage(
        "Password Changed Successfully",
        user,
        response
      );
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }

  public async changePassword({ request, response }: HttpContextContract) {
    let params = request.all();
    try {
      let existingUser = await BussinessUser.findOne({
        _id: params.user_id,
      }).select("+password");
      if (!params.password) {
        throw "old password is required";
      }
      let isSame = await hash.verify(existingUser!.password, params.password);

      if (!isSame) {
        throw "Invalid old password";
      }

      let user = await BussinessUser.updateOne(
        { _id: existingUser!.id },
        {
          $set: {
            password: await hash.make(params.newPass),
          },
        }
      );

      helpers.sendSuccessMessage(
        "Password Changed Successfully",
        user,
        response
      );
    } catch (e) {
      console.log(e);
      helpers.sendErrorMessage(e, {}, response);
    }
  }
  public async getProfile({ request, params, response }: HttpContextContract) {
    try {
      let user = await BussinessUser.findOne({ _id: params.id });
      if (!user) {
        helpers.sendErrorMessage("Id not found", {}, response);
      }

      helpers.sendSuccessMessage(
        "Profile Fetched Successfully",
        user,
        response
      );
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }
  public async getUsers({ request, params, response }: HttpContextContract) {
    try {
      let params = request.all();
      helpers.paginationParams(params);

      let query = {};
      // let user = await User.find({});
      let users: any = await User.paginate(query, {
        page: params.page,
        limit: params.limit,
      });

      helpers.sendSuccessMessage("Users Fetched Successfully", users, response);
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }

  public async updateProfile({ request, response }: HttpContextContract) {
    let params = request.all();
    try {
      let user = await BussinessUser.findOneAndUpdate(
        {
          _id: params.id,
        },
        { $set: params },
        { new: true }
      );
      if (!user) {
        helpers.sendErrorMessage("Id not found", {}, response);
        return;
      }
      helpers.sendSuccessMessage(
        "Profile Updated Successfully",
        user,
        response
      );
    } catch (e) {
      helpers.sendErrorMessage(e, {}, response);
    }
  }
}
