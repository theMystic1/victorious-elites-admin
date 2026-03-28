import { ClassNameType, LevelType } from "@/utils/types";
import cookie from "js-cookie";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const setCookie = (
  name: string,
  value: string,
  options: { expires?: number; path?: string } = {},
) => {
  const expires = options.expires || 365;
  cookie.set(name, value, { expires, path: options.path });
};
export const getCookie = (name: string): string | undefined => {
  return cookie.get(name);
};

export const removeCookie = (name: string) => {
  cookie.remove(name);
};

export const getInitials = (name: string): string => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
};

export const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const toOrdinal = (n: number) => {
  const num = Math.trunc(n);
  if (!Number.isFinite(num) || num <= 0) return "";

  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;

  switch (num % 10) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

export const constructClassName = (
  className: ClassNameType,
  level: LevelType,
) => {
  let name: string = className;

  if (level === "KG") {
    if (className === "PREKG") name = "Pre Nursery";
    else name = `Nursery ${className?.split("")[2]}`;
  }

  if (level === "PRIMARY") name = `Basic ${className?.split("")[1]}`;

  return name;
};

export const constructLevel = (level: LevelType) => {
  let levelName: string = level;

  if (level === "KG") levelName = "Nursery";
  if (level === "PRIMARY") levelName = "Basic";
  if (level === "JS") levelName = "Junior Secondary";
  if (level === "SS") levelName = "Senior Secondary";

  return levelName;
};
