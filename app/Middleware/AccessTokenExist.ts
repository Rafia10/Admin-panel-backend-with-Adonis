import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Helpers from "App/Helpers";
import AccessToken from "App/Models/AccessToken";
import BussinessUser from "App/Models/BussinessUser";

export default class AccessTokenExist {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    let access_token = request.header("X-Access-Token");

    if (access_token) {
      let access_token_data = await AccessToken.findOne({
        token: access_token,
      });
      console.log(access_token_data);
      if (!access_token_data || Date.now() > access_token_data.expiration) {
        return response
          .status(403)
          .send({ msg: "Invalid Access Token", data: {} });
      }

      let userData = await BussinessUser.findOne({
        _id: access_token_data.user_id,
      });

      if (!userData) {
        return Helpers.sendErrorMessage("User not exist", {}, response);
      }

      request.all().user_id = access_token_data.user_id;
    }

    await next();
  }
}
