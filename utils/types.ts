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

export type LevelType = "KG" | "PRIMARY" | "JS" | "SS";
export type ClassNameType =
  | "PREKG"
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
export type ClassType = {
  level: LevelType;
  _id?: string;
  name: ClassNameType;
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

export type TermType = {
  _id?: string;
  sessionId: string;
  term: "First" | "Second" | "Third";
  startDate: string;
  endDate: string;
  isActive?: boolean;
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

export type SubjectType = {
  _id?: string;
  name: string;
  isActive: boolean;
  code: string;
};

export type SubjectClassType = {
  _id?: string;
  subjectId?: string | SubjectType;
  classId?: string | ClassType;
  term: string[];
};

export type ResultType = {
  termId: string;
  sessionId: string;
  classId: string;
  studentId: string;
  subjectId: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
  pos?: number;
  classAverage?: number;
};

export type ResultCreateType = {
  subjectId: string;
  ca1: number;
  ca2: number;
  exam: number;
  // grade: string;
  remark: string;
};
