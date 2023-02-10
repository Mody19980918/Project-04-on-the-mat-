export interface commentFormat {
  id: number;
  username: string;
  comment: string;
  review: number;
}

export interface UserInformation {
  id: number;
  email: string;
  username: string;
  gender: "male" | "female" | "other";
}

export interface loginFormat {
  email: string;
  password: string;
}

export type Rule = {
  match: (value: string) => boolean | RegExpMatchArray | null;
  reason: string;
};

export interface classInformation {
  id?: number;
  class_name: string;
  teacher_name: string;
  class_type: "Hatha" | "Vinyasa" | "Yin" | "Wheel Yoga" | "Ashtanga";
  start_time: string;
  end_time: string;
  upper_limit: number;
  credits_needed: number;
  description: string;
  class_images: string;
}

export type UserRegister = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  gender: string;
  birth_date: string;
  phone_number: string;
};



export type BusinessRegister = {
  studio_name: string;
  email: string;
  password: string;
};

export type HomeUpcomingCardData = {
  name: string;
  type: string;
  start_time: Date;
  end_time: Date;
  studio_id: number;
  upper_limit: number;
  state: string;
  credits_needed: number;
  create_date: Date;
  description: string;
};

export type HathaData = {
  id?: number;
  class_name: string;
  teacher_name: string;
  class_type: "Hatha" | "Vinyasa" | "Yin" | "Wheel Yoga" | "Ashtanga";
  start_time: string;
  end_time: string;
  upper_limit: number;
  credit_needed: number;
  description: string;
  class_images: string;
};
