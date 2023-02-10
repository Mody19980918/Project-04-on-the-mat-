import { Knex } from "knex";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {
  //   console.log(process.env);

  // Deletes ALL existing entries !! Please remember the sequence of TABLE
  await knex("teachers_class").del();
  await knex("user_classes_lesson").del();
  await knex("images").del();
  await knex("classes_interval").del();
  await knex("class_reviews").del();
  await knex("studio_reviews").del();
  await knex("classes").del();
  await knex("teachers").del();
  await knex("studio").del();
  await knex("chat_record").del();
  await knex("user_bookmark").del();
  await knex("users").del();

  // When deleted id start by 1
  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE studio_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE teachers_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE classes_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE class_reviews_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE studio_reviews_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE images_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE chat_record_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE classes_interval_id_seq RESTART WITH 1");
  await knex.raw("ALTER SEQUENCE user_classes_lesson_id_seq RESTART WITH 1");

  await knex
    .insert([
      {
        phone_number: 68833888,
        email: `testing1@example.com`,
        first_name: "Jane",
        last_name: "Doe",
        gender: "female",
        password: await hashPassword("Testing123!"),
        admin: true,
        super_admin: false,
        credit: 0,
        birth_date: "1990-01-10",
        verification_status: "true",
      },
      {
        phone_number: 95382349,
        email: `testing2@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Ben",
        last_name: "Harris",
        gender: "male",
        admin: true,
        super_admin: false,
        credit: 0,
        birth_date: "1995-11-20",
        verification_status: "true",
      },
      {
        phone_number: 62394234,
        email: `testing3@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Chris",
        last_name: "Knight",
        gender: "male",
        admin: true,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
      },
      {
        phone_number: 95884366,
        email: `testing4@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Donny",
        last_name: "gaga",
        gender: "male",
        admin: true,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
      },
      {
        phone_number: 12341234,
        email: `testing5@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Jer",
        last_name: "Ching",
        gender: "male",
        admin: false,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
        finished_quiz: false,
        profile_pic: "path-1674033234809.png",
      },
      {
        phone_number: 12341234,
        email: `testing6@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Beeno",
        last_name: "Ching",
        gender: "male",
        admin: false,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
        finished_quiz: false,
        profile_pic: "path-1674033234809.png",
      },
      {
        phone_number: 12341234,
        email: `testing7@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Beeno",
        last_name: "Ching",
        gender: "male",
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "pending",
        finished_quiz: false,
        profile_pic: "path-1674033234809.png",
      },
      {
        phone_number: 12341234,
        email: `testing8@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Mody",
        last_name: "Ching",
        gender: "male",

        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "pending",
        finished_quiz: false,
        profile_pic: "path-1674033234809.png",
      },
      {
        phone_number: 12341234,
        email: `testing9@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Sam",
        last_name: "Ching",
        gender: "male",
        admin: false,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
        finished_quiz: false,
      },
      {
        phone_number: 12341234,
        email: `testing10@example.com`,
        password: await hashPassword("Testing123!"),
        first_name: "Ian",
        last_name: "Ching",
        gender: "male",
        admin: false,
        super_admin: false,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
        finished_quiz: false,
      },
      {
        phone_number: 12341234,
        email: `OnTheMat@example.com`,
        password: await hashPassword("Admin123!"),
        first_name: "Alex",
        last_name: "Ching",
        gender: "male",
        admin: false,
        super_admin: true,
        credit: 0,
        birth_date: "1985-06-12",
        verification_status: "true",
        finished_quiz: false,
        profile_pic: "path-1674033234809.png",
      },
    ])
    .into("users");

  await knex
    .insert([
      {
        name: "A-class Yoga",
        address: `Flat 25, 12/F ,Acacia Building 150 Kennedy Road ,WAN CHAI ,HONGKONG`,
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        phone_number: 95881314,
        email: `a-class@gmail.com`,
        positions: knex.raw("POINT(22.273270957307524, 114.1756832085247)"),
        verification_status: "true",
        business_user_id: 1,
        area: null,
        district: "wanChai",
      },
      {
        name: "Breathe Yoga",
        address: `Block A, 15/F Kingsford Ind Centre ,Kowloon Bay ,HONGKONG`,
        description: `This class incorporates yoga postures, gentle movement sequences, breath work, supported silent meditation, and guided relaxation to support increased awareness and mindfulness of the breath and body, and quieting of the nervous system.`,
        phone_number: 67671314,
        email: `breatheyogo@gmail.com`,
        positions: knex.raw("POINT(22.322360258257824, 114.21059068621814)"),
        verification_status: "true",
        business_user_id: 2,
        area: null,
        district: "kwunTong",
      },
      {
        name: "CathyChan Yoga",
        address: `Block 3, 7/F ,6 Science Park W Ave,Sha Tin, HONGKONG`,
        description: `In this class, postures are practiced to align, strengthen and promote flexibility in the body. Breathing techniques and meditation are also integrated.`,
        phone_number: 53541314,
        email: `cathychan@gmail.com`,
        positions: knex.raw("POINT(22.424908535893973, 114.21160429687076)"),
        verification_status: "true",
        business_user_id: 3,
        area: null,
        district: "shaTin",
      },
      {
        name: "Testing Yoga",
        address: `9/F Sun Fai Coml Centre,Yau Tsim Mong ,HONGKONG`,
        description: ` Breathing techniques and meditation are also integrated.`,
        phone_number: 93941314,
        email: `donnygaga@gmail.com`,
        positions: knex.raw("POINT(22.32220991420465, 114.16711333436731)"),
        verification_status: "pending",
        business_user_id: 7,
        area: null,
        district: "yauTsimMong",
      },
      {
        name: "Tecky Yoga",
        address: `9/F Sun Fai Coml Centre,Yau Tsim Mong ,HONGKONG`,
        description: ` Breathing techniques and meditation are also integrated.`,
        phone_number: 93941314,
        email: `donnygaga@gmail.com`,
        positions: knex.raw("POINT(22.32220991420465, 114.16711333436731)"),
        verification_status: "pending",
        business_user_id: 8,
        area: null,
        district: "yauTsimMong",
      },
      {
        name: "DonnyGaga Yoga",
        address: `9/F Sun Fai Coml Centre,Yau Tsim Mong ,HONGKONG`,
        description: ` Breathing techniques and meditation are also integrated.`,
        phone_number: 93941314,
        email: `donnygaga@gmail.com`,
        positions: knex.raw("POINT(22.32220991420465, 114.16711333436731)"),
        verification_status: "true",
        business_user_id: 4,
        area: null,
        district: "yauTsimMong",
      },
    ])
    .into("studio");

  await knex
    .insert([
      {
        name: "Aerial",
        descriptions:
          "Clayton is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 1,
      },
      {
        name: "Beeno",
        descriptions:
          "Beeno is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Candy",
        descriptions:
          "Candy is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Dora",
        descriptions:
          "Dora is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 4,
      },
      {
        name: "Apple",
        descriptions:
          "Apple is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Ben",
        descriptions:
          "Ben is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Calvin",
        descriptions:
          "Calvin is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Daisy",
        descriptions:
          "Calvin is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Edith",
        descriptions:
          "Edith is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Fabien",
        descriptions:
          "Fabien is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 2,
      },
      {
        name: "Zoe",
        descriptions:
          "Zoe is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Jack",
        descriptions:
          "Jack is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Lilian",
        descriptions:
          "Lilian is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Edith",
        descriptions:
          "Edith is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Pricilia",
        descriptions:
          "Pricilia is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 3,
      },
      {
        name: "Natalie",
        descriptions:
          "Natalie is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 4,
      },

      {
        name: "Stella",
        descriptions:
          "Stella is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 4,
      },
      {
        name: "Mody",
        descriptions:
          "Mody is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 4,
      },
      {
        name: "Jian",
        descriptions:
          "Jian is an experienced and internationally known KPJAYI Certified Ashtanga yoga teacher who was born in Oklahoma, USA on Teacher's Day, September 10. He discovered yoga at age 21 whilst living in San Francisco, California, when his mother took him to a pranayama class. After several years of practice and a long trip to India, he began teaching in 1996. To Clayton, yoga is a healing path back to the Self, allowing us to experience true peace and happiness. Being kind and living in balance with nature are qualities that continue to guide his life.",
        studio_id: 4,
      },
    ])
    .into("teachers");

  await knex
    .insert([
      {
        name: "Ashtanga Class",
        type: "Ashtanga",
        start_time: "2023-02-14 20:30:00",
        end_time: "2023-02-14 22:30:00",
        studio_id: 1,
        upper_limit: 10,
        credits_needed: 100,
        create_date: "2023-02-13 20:30:00",
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        teacher_id: 1,
      },
      {
        name: "Vinyasa Class",
        type: "Vinyasa",
        start_time: "2023-02-14 18:30:00",
        end_time: "2023-02-14 20:30:00",
        studio_id: 2,
        upper_limit: 10,
        credits_needed: 100,
        create_date: "2023-02-13 18:30:00",
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        teacher_id: 2,
      },
      {
        name: "Yin Class",
        type: "Yin",
        start_time: "2023-02-14 16:30:00",
        end_time: "2023-02-14 18:30:00",
        studio_id: 3,
        upper_limit: 10,
        credits_needed: 100,
        create_date: "2023-02-13  20:30:00",
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        teacher_id: 4,
      },
      {
        name: "Wheel Yoga Class",
        type: "Wheel-Yoga",
        start_time: "2023-02-14 14:30:00",
        end_time: "2023-02-14 16:30:00",
        studio_id: 1,
        upper_limit: 10,
        credits_needed: 100,
        create_date: "2023-02-13 20:30:00",
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        teacher_id: 1,
      },
      {
        name: "Hatha Class",
        type: "Hatha",
        start_time: "2023-02-14 12:30:00",
        end_time: "2023-02-14 14:30:00",
        studio_id: 2,
        upper_limit: 10,
        credits_needed: 100,
        create_date: "2023-02-13 20:30:00",
        description: `Your teacher will create a fluid unique sequence with a primary focus on generating internal heat through breath, sun salutations, balance, and strength.`,
        teacher_id: 2,
      },
    ])
    .into("classes");

  await knex
    .insert([
      {
        comment:
          "Class was super fun, teacher was nice and took care of all students :)",
        rating: 4,
        user_id: 6,
        class_id: 1,
      },
      {
        comment: "Felt so peaceful and relaxed after class",
        rating: 5,
        user_id: 9,
        class_id: 1,
      },
      {
        comment: "Class was a bit too easy for mr",
        rating: 3,
        user_id: 10,
        class_id: 1,
      },
      {
        comment: "Great Class!! Highly recommended for everyone",
        rating: 5,
        user_id: 6,
        class_id: 2,
      },
    ])
    .into("class_reviews");

  await knex
    .insert([
      {
        comment: "Spacious studio, amenities are new and clean",
        rating: 4,
        user_id: 6,
        create_date: "2023-02-15 22:30:00",
        studio_id: 1,
      },
      {
        comment: "Mats were dirty",
        rating: 2,
        user_id: 9,
        create_date: "2023-02-16 09:30:00",
        studio_id: 1,
      },
      {
        comment: "Convenient location",
        rating: 4,
        user_id: 10,
        create_date: "2023-02-16 08:20:00",
        studio_id: 1,
      },
    ])
    .into("studio_reviews");

  await knex
    .insert([
      {
        path: "http://www.aclass-studio.com/public/images/web/logo.png",
        class_id: 1,
        studio_id: null,
      },
      {
        path: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/cf/9c/our-studio-is-warm-and.jpg?w=1200&h=1200&s=1",
        class_id: 2,
        studio_id: null,
      },
      {
        path: "https://www.huttvalleynz.com/assets/Hutt/Elements/Images/Pause-Yoga-Cathy-doing-yoga-CREDIT-Pause-Yoga__FillWzEyMDAsNjAwXQ.jpg",
        class_id: 3,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: 4,
        studio_id: null,
      },
      {
        path: "http://www.aclass-studio.com/public/images/web/logo.png",
        class_id: 5,
        studio_id: null,
      },
      {
        path: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/cf/9c/our-studio-is-warm-and.jpg?w=1200&h=1200&s=1",
        class_id: 6,
        studio_id: null,
      },
      {
        path: "https://www.huttvalleynz.com/assets/Hutt/Elements/Images/Pause-Yoga-Cathy-doing-yoga-CREDIT-Pause-Yoga__FillWzEyMDAsNjAwXQ.jpg",
        class_id: 7,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: 8,
        studio_id: null,
      },
      {
        path: "http://www.aclass-studio.com/public/images/web/logo.png",
        class_id: 9,
        studio_id: null,
      },
      {
        path: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/cf/9c/our-studio-is-warm-and.jpg?w=1200&h=1200&s=1",
        class_id: 10,
        studio_id: null,
      },
      {
        path: "https://www.huttvalleynz.com/assets/Hutt/Elements/Images/Pause-Yoga-Cathy-doing-yoga-CREDIT-Pause-Yoga__FillWzEyMDAsNjAwXQ.jpg",
        class_id: 11,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: 12,
        studio_id: null,
      },
      {
        path: "http://www.aclass-studio.com/public/images/web/logo.png",
        class_id: 13,
        studio_id: null,
      },
      {
        path: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/cf/9c/our-studio-is-warm-and.jpg?w=1200&h=1200&s=1",
        class_id: 14,
        studio_id: null,
      },
      {
        path: "https://www.huttvalleynz.com/assets/Hutt/Elements/Images/Pause-Yoga-Cathy-doing-yoga-CREDIT-Pause-Yoga__FillWzEyMDAsNjAwXQ.jpg",
        class_id: 15,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: 16,
        studio_id: null,
      },
      {
        path: "http://www.aclass-studio.com/public/images/web/logo.png",
        class_id: 17,
        studio_id: null,
      },
      {
        path: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/f5/cf/9c/our-studio-is-warm-and.jpg?w=1200&h=1200&s=1",
        class_id: 18,
        studio_id: null,
      },
      {
        path: "https://www.huttvalleynz.com/assets/Hutt/Elements/Images/Pause-Yoga-Cathy-doing-yoga-CREDIT-Pause-Yoga__FillWzEyMDAsNjAwXQ.jpg",
        class_id: 19,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: 20,
        studio_id: null,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: null,
        studio_id: 4,
      },
      {
        path: "https://i1.wp.com/www.globalglam.com/wp-content/uploads/2018/09/Screen-Shot-2018-08-22-at-8.39.06-AM.png?resize=914%2C739&ssl=1",
        class_id: null,
        studio_id: 5,
      },
    ])
    .into("images");

  await knex
    .insert([
      {
        sender_id: 6,
        receiver_id: 2,
        messages: "HIHI",
        created_at: "2023-01-26 17:43:09.445705+08",
        receive_status: true,
        read_status: true,
      },
      {
        sender_id: 2,
        receiver_id: 6,
        messages: "HIHI",
        created_at: "2023-01-26 17:41:09.445705+08",
        receive_status: true,
        read_status: false,
      },

      {
        sender_id: 9,
        receiver_id: 1,
        messages: "HIHI",
        created_at: "2023-01-27 17:41:09.445705+08",
        receive_status: true,
        read_status: true,
      },

      {
        sender_id: 1,
        receiver_id: 9,
        messages: "HIHI",
        created_at: "2023-01-27 17:50:09.445705+08",
        receive_status: true,
        read_status: false,
      },

      {
        sender_id: 10,
        receiver_id: 3,
        messages: "HIHI",
        created_at: "2023-01-27 17:50:09.445705+08",
        receive_status: true,
        read_status: true,
      },
      {
        sender_id: 3,
        receiver_id: 10,
        messages: "HIHI",
        created_at: "2023-01-27 17:48:09.445705+08",
        receive_status: true,
        read_status: false,
      },
    ])
    .into("chat_record");
  await knex
    .insert([
      {
        classes_id: 1,
        date: "2023-01-23",
      },
      {
        classes_id: 1,
        date: "2023-01-30",
      },
      {
        classes_id: 1,
        date: "2023-02-06",
      },
      {
        classes_id: 1,
        date: "2023-02-13",
      },
      {
        classes_id: 1,
        date: "2023-02-20",
      },
      {
        classes_id: 2,
        date: "2023-01-23",
      },
      {
        classes_id: 2,
        date: "2023-01-30",
      },
      {
        classes_id: 2,
        date: "2023-02-06",
      },
      {
        classes_id: 2,
        date: "2023-02-13",
      },
      {
        classes_id: 2,
        date: "2023-02-20",
      },
      {
        classes_id: 3,
        date: "2023-01-23",
      },
      {
        classes_id: 3,
        date: "2023-01-30",
      },
      {
        classes_id: 3,
        date: "2023-02-06",
      },
      {
        classes_id: 3,
        date: "2023-02-13",
      },
      {
        classes_id: 3,
        date: "2023-02-20",
      },
      {
        classes_id: 4,
        date: "2023-01-23",
      },
      {
        classes_id: 4,
        date: "2023-01-30",
      },
      {
        classes_id: 4,
        date: "2023-02-06",
      },
      {
        classes_id: 4,
        date: "2023-02-13",
      },
      {
        classes_id: 4,
        date: "2023-02-20",
      },
      {
        classes_id: 5,
        date: "2023-01-23",
      },
      {
        classes_id: 5,
        date: "2023-01-30",
      },
      {
        classes_id: 5,
        date: "2023-02-06",
      },
      {
        classes_id: 5,
        date: "2023-02-13",
      },
      {
        classes_id: 5,
        date: "2023-02-20",
      },
    ])
    .into("classes_interval");

  await knex
    .insert([
      {
        user_id: 6,
        classes_id: 1,
      },
      {
        user_id: 6,
        classes_id: 2,
      },

      {
        user_id: 9,
        classes_id: 3,
      },
      {
        user_id: 9,
        classes_id: 4,
      },
      {
        user_id: 10,
        classes_id: 5,
      },
      {
        user_id: 10,
        classes_id: 6,
      },
      {
        user_id: 10,
        classes_id: 7,
      },
    ])
    .into("user_classes_lesson");
  await knex
    .insert([
      { user_id: 6, studio_id: 1 },
      { user_id: 9, studio_id: 1 },
      { user_id: 10, studio_id: 1 },
      { user_id: 6, studio_id: 2 },
      { user_id: 9, studio_id: 2 },
      { user_id: 10, studio_id: 2 },
      { user_id: 6, teacher_id: 19 },
      { user_id: 9, teacher_id: 19 },
      { user_id: 10, teacher_id: 19 },
    ])
    .into("user_bookmark");
}
