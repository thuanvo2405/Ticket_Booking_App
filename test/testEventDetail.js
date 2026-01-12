import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 200 },
  ],
};

export default function () {
  const eventId = `b417ccb8-a7e1-4b27-aab9-64c8bf37f52c`;
  const res = http.get(
    `http://localhost:3000/v1/api/event?maSuKien=${eventId}`
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response < 1s": (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
