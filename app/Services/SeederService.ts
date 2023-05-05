import BussinessUser from "App/Models/BussinessUser";

export default class SeederService {
  public static async initializeData() {
    try {
      let user = await BussinessUser.findOne({
        email: "rafia.qadir@cubixlabs.com",
      });

      if (!user) {
        let data = await BussinessUser.create({
          email: "rafia.qadir@cubixlabs.com",
          password: "12345678",
          status: "active",
          name: "Super Admin",
        });

        console.log(data);
      }

      // }
    } catch (e) {
      console.log(e);
    }
  }
}
