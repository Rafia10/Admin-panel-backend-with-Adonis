import AccessToken from "App/Models/AccessToken";
import Helpers from "App/Helpers";

export default class AccessTokenService {
  public async createTokenForUser(user_id) {
    await AccessToken.deleteMany({ user_id: user_id });

    let accessToken = new AccessToken({
      token: Helpers.generateUUID(),
      user_id: user_id,
      expiration: this.setExpiryTime(),
    });

    await accessToken.save();
    return accessToken;
  }

  private setExpiryTime() {
    let limit = 365;
    let date = Date.now() + limit * 24 * 60 * 60 * 1000;
    return date;
  }
}
