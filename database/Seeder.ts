import SeederService from "App/Services/SeederService";

export default class Seeder {
  public static async initializeAllData() {
    await SeederService.initializeData();
  }
}
