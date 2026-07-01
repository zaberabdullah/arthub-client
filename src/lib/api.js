export async function getToken() {
  const res = await fetch("/api/auth/get-session");
  const data = await res.json();
  return data?.session?.token;
}

export async function authFetch(url, options = {}) {
  const token = await getToken();
  
  const isFormData = options.body instanceof FormData;
  
  return fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
      "x-session-token": token,
    },
  });
}