const APPLIANCES_API = "http://localhost:8001";
const HEATING_API = "http://localhost:8002";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const getAppliances = () => request(`${APPLIANCES_API}/appliances`);
export const createAppliance = data => request(`${APPLIANCES_API}/appliances`, {
  method: "POST", body: JSON.stringify(data)
});
export const updateAppliance = (id, data) => request(`${APPLIANCES_API}/appliances/${id}`, {
  method: "PUT", body: JSON.stringify(data)
});
export const deleteAppliance = id => request(`${APPLIANCES_API}/appliances/${id}`, {
  method: "DELETE"
});
export const calculateRoom = data => request(`${HEATING_API}/calculate`, {
  method: "POST", body: JSON.stringify(data)
});
