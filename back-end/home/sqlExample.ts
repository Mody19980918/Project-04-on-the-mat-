// import { error } from "console";
// import express from "express";
// // import { lchownSync } from "fs";
// import { client } from "./env";

// export const filterRouter = express.Router();
// //take the type
// filterRouter.get("/getTheType", async function (req, res) {
//   try {
//     let result = await client.query("select * from main_event_type");
//     res.json(result.rows);
//   } catch (e) {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });

// // take district where id =1
// filterRouter.get("/localEventOfHK", async function (req, res) {
//   try {
//     let result = await client.query("select * from district where area_id=1");
//     res.json(result.rows);
//   } catch (e) {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });
// // take district where id =2
// filterRouter.get("/localEventOfKW", async function (req, res) {
//   // try{} catch(){console.log(error);
//   // res.json({})};
//   try {
//     let result = await client.query("select * from district where area_id=2");
//     res.json(result.rows);
//   } catch {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });
// // take district where id =3
// filterRouter.get("/localEventOfNTW", async function (req, res) {
//   try {
//     let result = await client.query("select * from district where area_id=3");
//     res.json(result.rows);
//   } catch (e) {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });
// // take district where id =4
// filterRouter.get("/localEventOfNTE", async function (req, res) {
//   try {
//     let result = await client.query("select * from district where area_id=4");
//     res.json(result.rows);
//   } catch (e) {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });

// // take sub type base on main type
// filterRouter.get("/getSubEvent", async function (req, res) {
//   try {
//     let min_type_id = req.query.typeId;

//     let result = await client.query(
//       `select * from sub_event_type where main_event_type_id=$1`,
//       [min_type_id]
//     );
//     console.log(result.rows);
//     res.json(result.rows);
//   } catch (error) {
//     res.status(400);
//     res.json({ message: "Server error" });
//   }
// });
// //default event filter
// //default event filter
// //default event filter
// //default event filter
// //default event filter
// filterRouter.get("/events", async function (req, res) {
//   try {
//     //select the user id for below checking for what we need to fill in content
//     let user_id = req.session.user?.id;
//     //the base card info we need
//     let selectSQL =
//       /*sql*/
//       `select username, district.name as district_name,
//     date, event_name,
//     event.id,
//     event_profile_photo,
//     sub_event_type_id,
//     event.full_address,
//     event.caption,
//     event_profile_photo,trainer_id
//     from event
//     inner join sub_event_type on sub_event_type_id = sub_event_type.id
//     inner join users on users.id = trainer_id
//     inner join district on district.id = district_id
//     where event.id in
//     ( select event.id
//     from event left join
//     (select count(*),
//     event_id
//     from training_class
//     group by event_id )
//     as count
//     on id=event_id
//     where (class_size - count) > 0 or (class_size - count) is null
//     )`;
//     if (user_id) {
//       selectSQL += `and trainer_id !=$1
//     and event.id not in (select event_id from training_class where student_id=$1)`;
//     }

//     //declare a obj to contain
//     let newObj = {};
//     //use the key to traval the body ,
//     //and creat a condition to check the value
//     //

//     if (Object.keys(req.query).length > 0) {
//       for (let key in req.query) {
//         if (req.query[key] !== "0" && req.query[key] !== "") {
//           newObj[key] = req.query[key];
//         }
//       }
//     }

//     let newSql = "";
//     for (const key in newObj) {
//       if (key == "date") {
//         newSql += " " + `and ${key}='${newObj[key]}'`;
//       } else {
//         newSql += " " + `and ${key}=${newObj[key]}`;
//       }
//     }

//     if (Object.keys(newObj).length > 0) {
//       selectSQL += newSql;
//     }

//     let result = await client.query(selectSQL, user_id ? [user_id] : []);
//     // console.log("result.rows:", result.rows);
//     res.json(result.rows);
//   } catch (e) {
//     console.log(error);
//     res.json({ message: "Server error" });
//   }
// });
