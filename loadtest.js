import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const pageLoadTime = new Trend("page_load_time");

const BASE = "https://ryven.in";
const API = `${BASE}/api/v1`;

/*
 * TEST STAGES — ramps up users gradually to find the breaking point
 *
 * Stage 1: Warm up with 10 users
 * Stage 2: Ramp to 50 users (moderate traffic)
 * Stage 3: Ramp to 100 users (busy day)
 * Stage 4: Spike to 200 users (stress test)
 * Stage 5: Cool down
 */
export const options = {
  stages: [
    { duration: "30s", target: 10 },   // warm up
    { duration: "1m", target: 50 },    // moderate load
    { duration: "1m", target: 100 },   // heavy load
    { duration: "30s", target: 200 },  // spike
    { duration: "30s", target: 200 },  // hold spike
    { duration: "30s", target: 0 },    // cool down
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"],   // 95% of requests under 3s
    errors: ["rate<0.1"],                // less than 10% errors
  },
};

// Simulate a real user journey
export default function () {
  const journeyType = Math.random();

  if (journeyType < 0.4) {
    browsingUser();       // 40% — just browsing
  } else if (journeyType < 0.7) {
    productViewer();      // 30% — viewing products
  } else if (journeyType < 0.9) {
    engagedShopper();     // 20% — deep engagement
  } else {
    apiHeavyUser();       // 10% — API-heavy (admin-like)
  }
}

// Journey 1: Casual browser — lands on homepage, looks at a couple pages
function browsingUser() {
  let res = http.get(BASE, { tags: { page: "homepage" } });
  check(res, { "homepage 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  pageLoadTime.add(res.timings.duration);
  sleep(randomBetween(1, 3));

  // Visit about or collections
  res = http.get(`${BASE}/collections`, { tags: { page: "collections" } });
  check(res, { "collections 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(1, 2));

  res = http.get(`${BASE}/about`, { tags: { page: "about" } });
  check(res, { "about 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(0.5, 1.5));
}

// Journey 2: Product viewer — browses products, views details
function productViewer() {
  // Load products page
  let res = http.get(`${BASE}/products`, { tags: { page: "products" } });
  check(res, { "products page 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  pageLoadTime.add(res.timings.duration);
  sleep(randomBetween(1, 2));

  // Hit products API
  res = http.get(`${API}/products`, { tags: { page: "api_products" } });
  check(res, { "products API 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(0.5, 1));

  // View specific product pages
  const slugs = ["noir-velvet", "rose-absolue", "cedar-smoke", "ocean-drift", "amber-nights", "white-tea"];
  const slug = slugs[Math.floor(Math.random() * slugs.length)];

  res = http.get(`${BASE}/products/${slug}`, { tags: { page: "pdp" } });
  check(res, { "PDP 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  pageLoadTime.add(res.timings.duration);
  sleep(randomBetween(2, 4)); // users spend more time on PDP

  // View another product
  const slug2 = slugs[Math.floor(Math.random() * slugs.length)];
  res = http.get(`${BASE}/products/${slug2}`, { tags: { page: "pdp" } });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(1, 2));
}

// Journey 3: Engaged shopper — products, cart, collections
function engagedShopper() {
  let res = http.get(BASE, { tags: { page: "homepage" } });
  errorRate.add(res.status !== 200);
  pageLoadTime.add(res.timings.duration);
  sleep(randomBetween(1, 2));

  // Browse a collection
  const collections = ["bestsellers", "new-arrivals", "for-him", "for-her"];
  const col = collections[Math.floor(Math.random() * collections.length)];
  res = http.get(`${BASE}/collections/${col}`, { tags: { page: "collection" } });
  errorRate.add(res.status >= 500);
  sleep(randomBetween(1, 3));

  // View products API
  res = http.get(`${API}/products`, { tags: { page: "api_products" } });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(0.5, 1));

  // View a product
  res = http.get(`${BASE}/products/noir-velvet`, { tags: { page: "pdp" } });
  errorRate.add(res.status !== 200);
  pageLoadTime.add(res.timings.duration);
  sleep(randomBetween(2, 4));

  // Visit cart
  res = http.get(`${BASE}/cart`, { tags: { page: "cart" } });
  errorRate.add(res.status !== 200);
  sleep(randomBetween(1, 2));
}

// Journey 4: API-heavy user — hits multiple API endpoints fast
function apiHeavyUser() {
  const endpoints = [
    `${API}/products`,
    `${API}/products/noir-velvet`,
    `${API}/products/rose-absolue`,
    `${API}/products/cedar-smoke`,
    `${API}/settings/public`,
  ];

  for (const url of endpoints) {
    const res = http.get(url, { tags: { page: "api" } });
    errorRate.add(res.status !== 200);
    sleep(randomBetween(0.2, 0.5));
  }
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}
