const API_URL = import.meta.env.VITE_API_URL;
export const URL = API_URL + "v1/api/";
export const IMAGE_URL = API_URL;

export const USER_ROLE = {
  NGUOI_DUNG: "NGUOI_DUNG",
  TO_CHUC: "TO_CHUC",
  QUAN_TRI: "QUAN_TRI",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const locations = [
  {
    name: "Hồ Chí Minh",
    image: "/locations/hcm.webp",
    link: "/events?city=hcm",
  },
  {
    name: "Hà Nội",
    image: "/locations/hanoi.webp",
    link: "/events?city=hanoi",
  },
  {
    name: "Đà Nẵng",
    image: "/locations/danang.webp",
    link: "/events?city=danang",
  },
  {
    name: "Khác",
    image: "/locations/other.webp",
    link: "/events?city=other",
  },
];
