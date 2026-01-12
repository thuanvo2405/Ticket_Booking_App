import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL =
  __ENV.K6_BASE_URL || "https://luan-van-tot-nghiep.onrender.com/v1/api";
const EVENT_ID = __ENV.K6_EVENT_ID || "ca8cf6cc-f353-42c5-9656-d1188baeaec4";

function pickNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const ORDER_QUANTITY = pickNumber(__ENV.K6_QUANTITY, 1);

export const options = {
  scenarios: {
    view_event: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },
        { duration: "30s", target: 50 },
        { duration: "30s", target: 100 },
      ],
      exec: "viewEvent",
      gracefulStop: "5s",
    },
    create_order: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 50,
      maxVUs: 200,
      stages: [
        { duration: "30s", target: 5 },
        { duration: "30s", target: 25 },
        { duration: "30s", target: 50 },
      ],
      exec: "createOrder",
      gracefulStop: "5s",
    },
  },
  thresholds: {
    "http_req_duration{scenario:view_event}": ["p(95)<1000"],
    "http_req_duration{scenario:create_order}": ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

export function setup() {
  const email = "vothuan2405003@gmail.com";
  const password = "123aA@";

  if (!email || !password) {
    throw new Error("Cần set K6_EMAIL và K6_PASSWORD để đăng nhập");
  }

  const loginRes = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({ email, matKhau: password }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "login has token": (r) => !!r.json()?.data?.tokens?.accessToken,
  });

  const token = loginRes.json("data.tokens.accessToken");
  if (!token) {
    throw new Error("Không lấy được access token");
  }

  const eventRes = http.get(`${BASE_URL}/event?maSuKien=${EVENT_ID}`);

  check(eventRes, {
    "event status 200": (r) => r.status === 200,
    "event has sessions": (r) =>
      Array.isArray(r.json()?.data?.suat_dien) &&
      r.json().data.suat_dien.length > 0,
  });

  const detail = eventRes.json().data || {};
  const sessions = Array.isArray(detail.suat_dien) ? detail.suat_dien : [];

  let ticketTypeId = __ENV.K6_TICKET_ID;

  if (!ticketTypeId) {
    for (const session of sessions) {
      const available = (session.loaiVe || []).find(
        (ticket) => ticket.soLuongConLai > 0
      );
      if (available) {
        ticketTypeId = available.maLoaiVe;
        break;
      }
    }
  }

  if (!ticketTypeId) {
    throw new Error(
      "Không tìm thấy loại vé còn chỗ. Set K6_TICKET_ID để chỉ định thủ công"
    );
  }

  return {
    token,
    eventId: EVENT_ID,
    ticketTypeId,
    orderQty: ORDER_QUANTITY,
  };
}

export function viewEvent(data) {
  const res = http.get(`${BASE_URL}/event?maSuKien=${data.eventId}`);

  check(res, {
    "view status 200": (r) => r.status === 200,
    "view < 1s": (r) => r.timings.duration < 1000,
  });

  sleep(1);
}

export function createOrder(data) {
  const payload = JSON.stringify({
    items: [{ maloaive: data.ticketTypeId, soluong: data.orderQty }],
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.token}`,
  };

  const res = http.post(`${BASE_URL}/order`, payload, { headers });

  check(res, {
    "order status 201": (r) => r.status === 201,
    "order response time < 1.5s": (r) => r.timings.duration < 1500,
  });

  sleep(1);
}
