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
