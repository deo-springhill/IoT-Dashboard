let accessToken = null;
let refreshToken = null;
let tokenExpiry = 0;

export async function getAccToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const loginUrl = `${process.env.API_BASE_URL}/auth/web/login`;
  const loginRes = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.API_EMAIL,
      password: process.env.API_PASSWORD,
    }),
  });
  
  const loginText = await loginRes.text();
  if (!loginRes.ok) {
    throw new Error(`Login failed (${loginRes.status})`);
  }

  const loginData = JSON.parse(loginText);

  const bmUrl = `${process.env.API_BASE_URL}/auth/web/login/bm/1`;
  const rshRes = await fetch(bmUrl, {
    headers: {
      Authorization: `Bearer ${loginData.accessToken}`,
    },
  });

  const bmText = await rshRes.text();
  if (!rshRes.ok) {
    throw new Error(`Token exchange failed (${rshRes.status})`);
  }

  const rshData = JSON.parse(bmText);

  accessToken = rshData.accessToken;
  refreshToken = rshData.refreshToken;
  tokenExpiry = Date.now() + 55 * 60 * 1000;

  return accessToken;
}
