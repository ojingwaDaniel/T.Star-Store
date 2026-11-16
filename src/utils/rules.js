import { isEmail, isNgPhone } from "./validators";

const filled = (v) =>
  typeof v === "string"
    ? v.trim().length > 0
    : v !== null && v !== undefined && v !== "" && v !== false;

// A rule is (value, form) => errorMessage | ''
export const req =
  (msg = "This field is required.") =>
  (v) =>
    filled(v) ? "" : msg;
export const email =
  (msg = "Enter a valid email address.") =>
  (v) =>
    !filled(v) || isEmail(v) ? "" : msg;
export const phone =
  (msg = "Enter a valid Nigerian phone number.") =>
  (v) =>
    !filled(v) || isNgPhone(v) ? "" : msg;
export const minLength = (n, msg) => (v) =>
  !filled(v) || String(v).length >= n
    ? ""
    : msg || `Must be at least ${n} characters.`;
export const same =
  (other, msg = "Values do not match.") =>
  (v, form) =>
    v === form[other] ? "" : msg;
