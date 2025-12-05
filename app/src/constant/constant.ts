export const URL = "http://127.0.0.1:3000/v1/api/";
export const IMAGE_URL = "http://127.0.0.1:3000/";

export const USER_ROLE = {
  NGUOI_DUNG: "NGUOI_DUNG",
  TO_CHUC: "TO_CHUC",
  QUAN_TRI: "QUAN_TRI",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const locations = [
  {
    name: "Hồ Chí Minh",
    image: "/locations/hcm.jpg",
    link: "/events?city=hcm",
  },
  {
    name: "Hà Nội",
    image: "/locations/hanoi.jpg",
    link: "/events?city=hanoi",
  },
  {
    name: "Đà Nẵng",
    image: "/locations/danang.jpg",
    link: "/events?city=danang",
  },
  {
    name: "Khác",
    image: "/locations/other.jpg",
    link: "/events?city=other",
  },
];
