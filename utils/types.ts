export type LogoSizes = "sm" | "md" | "lg" | "xl";

export type USERROLE = "STAFF" | "PRINCIPAL" | "ADMIN" | "SUPER_ADMIN";

export type METype = {
  _id: string;
  email: string;
  phoneNumber?: string;
  isActive?: boolean;
  firstName: string;
  lastName: string;
  role: USERROLE;
  gender: "MALE" | "FEMALE";
};

export type LoginForm = {
  email: string;
  password: string;
};

export type ClassType = {
  level: "KG" | "PRIMARY" | "JS" | "SS";
  _id?: string;
  name:
    | "KG1"
    | "KG2"
    | "KG3"
    | "P1"
    | "P2"
    | "P3"
    | "P4"
    | "P5"
    | "P6"
    | "JS1"
    | "JS2"
    | "JS3"
    | "SS1"
    | "SS2"
    | "SS3";
  arm: string;
  isActive: boolean;
};

export type SessionType = {
  _id?: string;
  session: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type StudentsType = {
  _id?: string;
  fullName: string;
  age: number;
  gender: "MALE" | "FEMALE";
  curClassId: ClassType | string;
  curSessionId?: SessionType | string;
  results?: any[];
  studentsId: string;
};
