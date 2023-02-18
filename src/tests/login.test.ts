import dotenv from "dotenv";
dotenv.config();

import httpClient from "starless-http";

const domain = "http://localhost:3000/starless-iam";

describe("Login cases", () => {
  it("should login with superadmin account", async () => {
    const [response, err] = await httpClient.post(`${domain}/login`, {
      appcode: process.env.app_code,
      username: process.env.admin_username,
      password: process.env.admin_password,
    });
    let token = null;
    if (response && response.data.data) {
      token = response.data.data.token;
    }
    expect(token).toBeTruthy();
  });
});
