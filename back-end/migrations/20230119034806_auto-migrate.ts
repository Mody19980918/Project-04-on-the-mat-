import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id");
      table.specificType("phone_number", "char(8)").nullable();
      table.string("email", 255).nullable().unique();
      table.string("first_name", 100).nullable();
      table.string("last_name", 100).nullable();
      table.string("password", 255).nullable();
      table.string("gender", 10).nullable();
      table.string("profile_pic", 255).nullable();
      table.boolean("admin").nullable();
      table.boolean("super_admin").nullable();
      table.integer("credit").nullable();
      table.date("birth_date").nullable();
      table.string("verification_status", 25).nullable();
      table.integer("verification_code").nullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("studio"))) {
    await knex.schema.createTable("studio", (table) => {
      table.increments("id");
      table
        .integer("business_user_id")
        .unsigned()
        .notNullable()
        .references("users.id");
      table.string("name", 255).notNullable();
      table.string("address", 255).notNullable();
      table.string("description", 1000).notNullable();
      table.integer("phone_number", 8).notNullable();
      table.string("email", 50).notNullable();
      table.point("latitude").nullable();
      table.point("longitude").nullable();
      table.string("verification_status", 25).nullable();
      table.string("area", 255).nullable();
      table.string("district", 255).nullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("studio_area"))) {
    await knex.schema.createTable("studio_area", (table) => {
      table.increments("id");
      table.string("area", 255).notNullable();
      table.string("district", 255).notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("teachers"))) {
    await knex.schema.createTable("teachers", (table) => {
      table.increments("id");
      table.string("name", 100).notNullable();
      table.string("descriptions", 3000).nullable();
      table.decimal("rating").nullable();
      table
        .integer("studio_id")
        .unsigned()
        .notNullable()
        .references("studio.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("classes"))) {
    await knex.schema.createTable("classes", (table) => {
      table.increments("id");
      table.string("name", 255).notNullable();
      table.string("type", 255).notNullable();
      table.timestamp("start_time").notNullable();
      table.timestamp("end_time").notNullable();
      table
        .integer("studio_id")
        .unsigned()
        .notNullable()
        .references("studio.id");
      table.integer("upper_limit").notNullable();
      table.string("state", 50).nullable();
      table.integer("credits_needed").notNullable();
      table.timestamp("create_date").notNullable();
      table.string("description", 255).notNullable();
      table
        .integer("teacher_id")
        .unsigned()
        .notNullable()
        .references("teachers.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("user_credit_event"))) {
    await knex.schema.createTable("user_credit_event", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table
        .integer("class_id")
        .unsigned()
        .notNullable()
        .references("classes.id");
      table.string("event", 255).notNullable();
      table.integer("credit_change").notNullable();
      table.timestamp("create_date").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("classes_interval"))) {
    await knex.schema.createTable("classes_interval", (table) => {
      table.increments("id");
      table
        .integer("classes_id")
        .unsigned()
        .notNullable()
        .references("classes.id");
      table.date("date").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("teachers_class"))) {
    await knex.schema.createTable("teachers_class", (table) => {
      table.increments("id");
      table
        .integer("teachers_id")
        .unsigned()
        .notNullable()
        .references("teachers.id");
      table
        .integer("classes_id")
        .unsigned()
        .notNullable()
        .references("classes.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("class_reviews"))) {
    await knex.schema.createTable("class_reviews", (table) => {
      table.increments("id");
      table.string("comment", 2500).notNullable();
      table.integer("rating").notNullable();
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table
        .integer("class_id")
        .unsigned()
        .notNullable()
        .references("classes.id");
      table.date("create_date").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("studio_reviews"))) {
    await knex.schema.createTable("studio_reviews", (table) => {
      table.increments("id");
      table.string("comment", 2500).nullable();
      table.integer("rating").nullable();
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table.date("create_date").notNullable();
      table
        .integer("studio_id")
        .unsigned()
        .notNullable()
        .references("studio.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("user_classes_lesson"))) {
    await knex.schema.createTable("user_classes_lesson", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table
        .integer("classes_id")
        .unsigned()
        .notNullable()
        .references("classes_interval.id");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("payment_record"))) {
    await knex.schema.createTable("payment_record", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table.decimal("amount").notNullable();
      table.timestamp("transaction_date").notNullable();
      table.timestamp("create_date").notNullable();
      table.integer("credit").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("forum_category"))) {
    await knex.schema.createTable("forum_category", (table) => {
      table.increments("id");
      table.string("category", 255).notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("forum_topic"))) {
    await knex.schema.createTable("forum_topic", (table) => {
      table.increments("id");
      table
        .integer("forum_category")
        .unsigned()
        .notNullable()
        .references("forum_category.id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table.timestamp("create_time").notNullable();
      table.string("post_content", 3000).notNullable();
      table.string("topic", 255).notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("forum_comment"))) {
    await knex.schema.createTable("forum_comment", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table.string("comment", 3000).notNullable();
      table
        .integer("forum_topic")
        .unsigned()
        .notNullable()
        .references("forum_topic.id");
      table.timestamp("create_time").notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("images"))) {
    await knex.schema.createTable("images", (table) => {
      table.increments("id");
      table.string("path", 255).notNullable();
      table.integer("class_id").nullable();
      table.integer("studio_id").nullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("user_bookmark"))) {
    await knex.schema.createTable("user_bookmark", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable().references("users.id");
      table.integer("teacher_id").nullable();
      table.integer("studio_id").nullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("meta_classes"))) {
    await knex.schema.createTable("meta_classes", (table) => {
      table.increments("id");
      table
        .integer("classes_id")
        .unsigned()
        .notNullable()
        .references("classes.id");
      table.string("interval", 255).nullable();
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("meta_classes");
  await knex.schema.dropTableIfExists("user_bookmark");
  await knex.schema.dropTableIfExists("images");
  await knex.schema.dropTableIfExists("forum_comment");
  await knex.schema.dropTableIfExists("forum_topic");
  await knex.schema.dropTableIfExists("forum_category");
  await knex.schema.dropTableIfExists("payment_record");
  await knex.schema.dropTableIfExists("user_classes_lesson");
  await knex.schema.dropTableIfExists("studio_reviews");
  await knex.schema.dropTableIfExists("class_reviews");
  await knex.schema.dropTableIfExists("teachers_class");
  await knex.schema.dropTableIfExists("classes_interval");
  await knex.schema.dropTableIfExists("user_credit_event");
  await knex.schema.dropTableIfExists("classes");
  await knex.schema.dropTableIfExists("teachers");
  await knex.schema.dropTableIfExists("studio_area");
  await knex.schema.dropTableIfExists("studio");
  await knex.schema.dropTableIfExists("users");
}
