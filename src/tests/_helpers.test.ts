import { BASE_URL } from "../utils/constants";

export const sendPostRequest = async (endpoint: string, data: object, headers: HeadersInit = {}) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
  console.log(response)
  const body = await response.json();
  return { status: response.status, body };
};

export const sendGetRequest = async (endpoint: string, headers: HeadersInit = {}) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  const body = await response.json();
  return { status: response.status, body };
};
