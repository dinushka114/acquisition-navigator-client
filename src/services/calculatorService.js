import { api } from "../lib/api.js";

export function calcExitValue(body) {
  return api("/api/calculators/exit-value", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function calcNetWorkingCapital(body) {
  return api("/api/calculators/net-working-capital", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function calcDealAffordability(body) {
  return api("/api/calculators/deal-affordability", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function calcBuyingPower(body) {
  return api("/api/calculators/buying-power", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
