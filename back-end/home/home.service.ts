import { Knex } from "knex";
// https://stackoverflow.com/questions/6850500/postgis-installation-type-geometry-does-not-exist
export class HomeService {
  constructor(private knex: Knex) {}

  async upcomingCardInfo(classes_id: number) {
    try {
      let resData = await this.knex("classes")
        .select("classes.*", "studio.address", "classes_interval.date as date")
        .join("studio", "classes.studio_id", "=", "studio.id")
        .join(
          "classes_interval",
          "classes_interval.classes_id",
          "=",
          "classes.id"
        )

        .orderBy("classes_interval.date");

      for (let [i, v] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });

        resData[i].imagesList = imagesArr;
      }

      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  //
  //
  //
  //
  //
  async typeOfYoga(class_type: string) {
    try {
      console.log(class_type);

      let resData = await this.knex("classes")
        .select("classes.*", "studio.address", "classes_interval.date as date")
        .join("studio", "classes.studio_id", "=", "studio.id")
        .join(
          "classes_interval",
          "classes_interval.classes_id",
          "=",
          "classes.id"
        )
        .where("type", "=", class_type)
        .orderBy("classes_interval.date");

      for (let [i, v] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });

        resData[i].imagesList = imagesArr;
      }
      // console.log("resData", resData);
      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //

  async nearestCardInfo(userPol: number[]) {
    try {
      // const studioList = await this.knex("studio").select("*"); //backend

      let studioList = await this.knex("classes")
        .select(
          "classes.*",
          "studio.address",
          "studio.positions",
          "classes_interval.date as date"
        )
        .join("studio", "classes.studio_id", "=", "studio.id")
        .join(
          "classes_interval",
          "classes_interval.classes_id",
          "=",
          "classes.id"
        )
        .orderBy("classes_interval.date");

      let allDistArr = [];

      for (let studio of studioList) {
        // console.log(userPol);
        // console.log(studio.positions);

        let result: any;
        try {
          const sqlquery = `SELECT ST_Distance(
              ST_Transform('SRID=4326;POINT(${userPol[1]} ${userPol[0]})'::geometry, 2163),
              ST_Transform('SRID=4326;POINT(${studio.positions.y} ${studio.positions.x})'::geometry, 2163)
            )
          `;

          await this.knex.raw(sqlquery);
        } catch (error) {
          result = { rows: [{ st_distance: 0 }] };
        }

        allDistArr.push({
          ...studio,
          dist: result.rows[0],
        });
      }

      allDistArr.sort((a, b) => a.dist.st_distance - b.dist.st_distance);

      //card data
      // let resData = await this.knex("classes")
      //   .select("classes.*", "studio.address")
      //   .join("studio", "classes.studio_id", "=", "studio.id")
      //   .orderBy("classes.start_time");

      // date of image
      for (let [i, v] of allDistArr.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });
        allDistArr[i].imagesList = imagesArr;
      }
      //distance of  user between user and studio
      // console.log(`allDistArr`, allDistArr);
      return { allDistArr };
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  //
  //
  //

  //
  //
  //
  //
  //
  async seeAllClassInfo() {
    try {
      let resData = await this.knex("classes")
        .select("classes.*", "studio.address", "classes_interval.date as date")
        .join("studio", "classes.studio_id", "=", "studio.id")
        .join(
          "classes_interval",
          "classes_interval.classes_id",
          "=",
          "classes.id"
        )
        .orderBy("classes_interval.date");

      for (let [i, v] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });

        resData[i].imagesList = imagesArr;
      }

      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  //
  //
  //
  //
  //
  //
  //
  async filterMap() {
    try {
      let resData = await this.knex("studio").select(
        "id",
        "positions",
        "name",
        "address",
        "description"
      );

      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //await this.knex("classes")
  // .select("classes.*", "studio.address", "classes_interval.date as date")
  // .join("studio", "classes.studio_id", "=", "studio.id")
  // .join(
  //   "classes_interval",
  //   "classes_interval.classes_id",
  //   "=",
  //   "classes.id"
  // )
  // .orderBy("classes_interval.date");
  async filterList(body: any) {
    try {
      const selectedType = body.selectedType; //classes type
      const selectedDate = body.selectedDate; //classes_interval &&
      const selectedLocation = body.selectedLocation; //studio location
      const selectedCreditRange = body.selectedCreditRange; // classes credit_range
      console.log(
        selectedType,
        selectedDate,
        selectedLocation,
        selectedCreditRange
      );

      const selectedDateArr = selectedDate.split(",");
      const startDate = new Date(selectedDateArr[0]);
      const endDate = new Date(selectedDateArr[1]);
      // console.log({ startDate, endDate });

      let resData = await this.knex("classes")
        .select(
          "classes.*",
          "studio.district",
          "classes_interval.date as date",
          "studio.address"
        )
        .join("studio", "classes.studio_id", "=", "studio.id") // ?_?
        .join(
          "classes_interval",
          "classes_interval.classes_id",
          "=",
          "classes.id"
        )
        .where("classes.type", "=", selectedType)
        // .andWhere("classes.start_time", ">", startDate)
        // .andWhere("classes.end_time", "<", endDate)
        .andWhere("classes_interval.date", ">", startDate)
        .andWhere("classes_interval.date", "<", endDate)
        .andWhere("studio.district", "=", selectedLocation)

        .orderBy("classes_interval.date"); // ?_?
      // console.log("resData:", resData);

      for (let [i, v] of resData.entries()) {
        let imagesArr = await this.knex("images")
          .select("*")
          .where({ class_id: v.id });

        resData[i].imagesList = imagesArr;
      }
      // console.log(`resData:`, resData);
      return resData;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //
}
