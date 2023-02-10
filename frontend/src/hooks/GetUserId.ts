import jwtDecode from "jwt-decode";
import { User } from "../store/userSlice";

export function getUserId() {
  let token = localStorage.getItem("token");
  let payload: User = jwtDecode(token!);
  let id = payload.id;
  return id;
}
