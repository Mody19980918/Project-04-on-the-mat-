import jwtDecode from "jwt-decode";
import { decode } from "punycode";

type Payload = {
  id: number;
  admin: boolean;
  super_admin: boolean;
};

export function getLocalStorage() {
  let token = localStorage.getItem("token");
  console.log("token", token);
  if (token) {
    let decoded: Payload = jwtDecode(token);
    console.log("decoded", decoded);
    let user = {
      id: decoded.id,
      admin: decoded.admin,
      super_admin: decoded.super_admin,
      token
    };
    return user;
  }

  return null;
}

export function clearLocalStorage() {
  localStorage.removeItem("token");
}
