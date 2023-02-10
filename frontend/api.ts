let production_api_origin = "https://api-onthemat.stellawoo.me";

let s3_bucket_name = "";
let s3_region = "";

export const api_origin = getAPIOrigin();

export let is_production = api_origin == production_api_origin;

export function getAPIOrigin() {
  let origin = window.location.origin;
  if (origin.startsWith("http://localhost:")) {
    return "http://localhost:8080";
  }
  if (origin.startsWith("http://127.")) {
    return origin.replace(":3000", ":8080");
  }
  if (origin.startsWith("http://192.")) {
    return origin.replace(":3000", ":8080");
  }
  return production_api_origin;
}

export function handleResponse(promise: Promise<Response>) {
  return promise
    .then((res) => res.json())
    .catch((err) => ({ error: String(err) }));
}

export function post(pathname: string, body: object) {
  let url = api_origin + pathname;
  let token = localStorage.getItem("token");
  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return handleResponse(
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  );
}

export function upload(pathname: string, formData: FormData) {
  let url = api_origin + pathname;
  let token = localStorage.getItem("token");
  let headers: HeadersInit = {};
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return handleResponse(
    fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })
  );
}

export function toUploadsUrl(filename: string) {
  if (api_origin == production_api_origin) {
    return (
      `https://${s3_bucket_name}.s3.${s3_region}.amazonaws.com/` + filename
    );
  }
  return api_origin + "/uploads/" + filename;
}
