import { expect, test } from "vitest";
import { CozyLifeClient } from "../";

test("API client", async () => {
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;
  if (!userEmail || !userPassword) {
    throw new Error(
      "Please provide `USER_EMAIL` and `USER_PASSWORD` in the `.env` file"
    );
  }

  const client = new CozyLifeClient(userEmail, userPassword);
  expect(client).not.toBeUndefined();

  await client.init();

  expect(client["devices"]).toBeTypeOf("object");
});
