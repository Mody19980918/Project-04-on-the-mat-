import { Knex } from "knex";

export class ChatRecordService {
  constructor(private knex: Knex) {}
  async getChatRecord(owner_id: string, id: string) {
    try {
      await this.knex("chat_record")
        .update({ read_status: true })
        .where({ sender_id: id, receiver_id: owner_id })
        .orWhere({});
      let chatRecord = await this.knex
        .select(
          "users.first_name" as "username",
          "chat_record.sender_id" as "sender_id",
          "chat_record.receiver_id" as "receiver_id",
          "chat_record.messages" as "messages",
          "chat_record.created_at" as "send_time"
        )
        .from("chat_record")
        .join("users", "users.id", "chat_record.sender_id")
        .where({
          "chat_record.sender_id": owner_id,
          "chat_record.receiver_id": id,
        })
        // .orderBy("created_at", "desc")
        .union([
          this.knex
            .join("users", "users.id", "chat_record.sender_id")
            .select(
              "users.first_name" as "username",
              "chat_record.sender_id" as "sender_id",
              "chat_record.receiver_id" as "receiver_id",
              "chat_record.messages" as "messages",
              "chat_record.created_at" as "send_time"
            )
            .from("chat_record")
            .where({
              "chat_record.sender_id": id,
              "chat_record.receiver_id": owner_id,
            }),
          // .orderBy("chat_record.created_at", "desc"),
        ]);

      chatRecord.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      console.log(chatRecord);

      await Promise.all(
        chatRecord.map(async (v) => {
          let studio_name = await this.knex
            .select("studio.name")
            .from("users")
            .where("users.id", v.sender_id)
            .join("studio", "studio.business_user_id", "users.id");

          if (studio_name.length > 0) {
            v.first_name = studio_name[0].name;
          }
        })
      );
      return chatRecord;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  async getChatList(id: string) {
    try {
      let res = await this.knex.raw(
        `
        with list as (
            select receiver_id as other_id,
                created_at,
                id,
                read_status
            from chat_record
            where sender_id = ${id}
            UNION
            select sender_id as other_id,
                created_at,
                id,
                read_status
            from chat_record
            where receiver_id = ${id}
        ),
        max_list as (
            select other_id,
                max(created_at) as last_time,
                SUM( (read_status = 'false')::int) as amountOfRead_status
            from list
            group by other_id
        )
        select users.first_name,
            chat_record.messages,
            last_time,
            other_id,
            amountOfRead_status
        from chat_record
            inner join max_list on chat_record.created_at = last_time
            inner join users on users.id = other_id
        `
      );
      console.log(res.rows);
      await Promise.all(
        res.rows.map(async (v: any) => {
          let studio_name = await this.knex
            .select("studio.name")
            .from("users")
            .where("users.id", v.other_id)
            .join("studio", "studio.business_user_id", "users.id");

          if (studio_name.length > 0) {
            v.first_name = studio_name[0].name;
          }
        })
      );
      return res.rows;
    } catch (error) {
      return error;
    }
  }
  async getChatUnread(user_id: number) {
    try {
      let res = await this.knex.raw(
        `select SUM((read_status = 'false')::int) as amountOfRead_status,
sender_id
from chat_record
where receiver_id = ?
GROUP BY sender_id`,
        [user_id]
      );

      return res.rows;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getCountOfUserUnread(user_id: number) {
    console.log(user_id);

    try {
      let res = await this.knex.raw(
        `select sum((read_status = 'false')::int) as countOfRead_status,
receiver_id
from chat_record
where receiver_id = ?
GROUP BY receiver_id
`,
        [user_id]
      );
      console.log(res.rows);
      return res.rows;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
