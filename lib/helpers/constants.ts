import { IoSchoolOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuSettings, LuUser, LuUsers } from "react-icons/lu";
import { PiCertificateBold } from "react-icons/pi";
import emptyBoxImg from "@/public/images/empty-box.jpg";

export const publicRoutes = [
  "/login",
  "/forgot-password",
  "/otp",
  "/reset-password",
];

export const protectedRoutes = [
  "/",
  "/students",
  "/dashboard",
  "/staffs",
  "/school",
  "/school/class",
  "/school/subject",
  "/results",
];

export const navItems = [
  { label: "Overview", href: "/", ICON: LuLayoutDashboard },
  { label: "Students", href: "/students", ICON: LuUsers },
  { label: "Staffs", href: "/staffs", ICON: LuUser },
  { label: "School", href: "/school", ICON: IoSchoolOutline },
  { label: "Results", href: "/results", ICON: PiCertificateBold },
];

export const classLevels = [
  { value: "KG", label: "Nursery" },
  { value: "PRIMARY", label: "Basic" },
  { value: "JS", label: "Junior Secondary" },
  { value: "SS", label: "Senior Secondary" },
];

export const groupClasses = {
  KG: [
    { value: "KG1", label: "Kg 1" },
    { value: "KG2", label: "Kg 2" },
    { value: "KG3", label: "Kg 3" },
  ],
  PRIMARY: [
    { value: "P1", label: "Primary 1" },
    { value: "P2", label: "Primary 2" },
    { value: "P3", label: "Primary 3" },
    { value: "P4", label: "Primary 4" },
    { value: "P5", label: "Primary 5" },
    { value: "P6", label: "Primary 6" },
  ],
  JS: [
    { value: "JS1", label: "JS 1" },
    { value: "JS2", label: "JS 2" },
    { value: "JS3", label: "JS 3" },
  ],
  SS: [
    { value: "SS1", label: "SS 1" },
    { value: "SS2", label: "SS 2" },
    { value: "SS3", label: "SS 3" },
  ],
};

export const IMAGES = { emptyBoxImg };
