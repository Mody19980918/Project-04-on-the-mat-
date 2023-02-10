import { useSelector } from "react-redux";
import { IRootState } from "../store/store";
let api_origin = import.meta.env.VITE_BACKEND_URL;

export function useFetch() {
  const token = useSelector((state: IRootState) => state.user.user?.token);

  async function post(url: string, data: string | Object) {
    let res = await fetch(api_origin + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function get(url: string) {
    let res = await fetch(api_origin + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.json();
  }

  async function put(url: string, data: string | Object) {
    let res = await fetch(api_origin + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async function patch(url: string, data: string | Object) {
    let res = await fetch(api_origin + url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  async function deleted(url: string, data: string | Object) {
    let res = await fetch(api_origin + url, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function fileRouter(url: string, data: FormData, method: string) {
    let res = await fetch(api_origin + url, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: data,
    });
    return res.json();
  }

  return { post, get, fileRouter, put, deleted, patch };
}
