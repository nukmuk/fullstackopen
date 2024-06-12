const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const loginText = await page.getByText("log in to application");
    expect(loginText).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      await expect(
        page.getByText("Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      createBlog(page, "test title", "test author", "example.com");

      const success = await page.getByText("added").waitFor();
      await expect(success).toBeVisible;
    });

    test("blog can be liked", async ({ page }) => {
      createBlog(page, "test title", "test author", "example.com");

      await page.getByText("added").waitFor();
      await page.getByText("view").click();
      await page.getByText("like").click();
      const likes = await page.getByText("likes 1", { exact: false });
      await expect(likes).toBeVisible();
    });

    test("blog can be deleted by its owner", async ({ page }) => {
      page.on("dialog", (dialog) => dialog.accept());
      createBlog(page, "test title", "test author", "example.com");

      await page.getByText("added").waitFor();
      await page.getByText("view").click();
      await page.getByText("remove").click();
      const deletedBlog = await page.getByText("test title test author");
      await expect(deletedBlog).not.toBeVisible();
    });

    test("only blog owner can see remove button", async ({ page, request }) => {
      await request.post("/api/users", {
        data: {
          name: "Matti Luukkainen2",
          username: "mluukkai2",
          password: "salainen",
        },
      });

      page.on("dialog", (dialog) => dialog.accept());
      createBlog(page, "test title", "test author", "example.com");

      await page.getByText("added").waitFor();
      await page.getByText("view").click();
      const removeButtonCreator = await page.getByText("remove");
      expect(removeButtonCreator).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await loginWith(page, "mluukkai2", "salainen");
      await page.getByText("view").click();
      const removeButtonOther = await page.getByText("remove");

      await expect(removeButtonOther).not.toBeVisible();
    });

    test("blogs are sorted correctly based on likes", async ({ page }) => {
      await createBlog(page, "first blog", "test author", "example.com");
      await createBlog(page, "second blog", "test author", "example.com");

      await page.getByText("second blog test author view").waitFor();
      const viewButtons = await page
        .getByRole("button", { name: "view" })
        .all();
      console.log(viewButtons);
      for (const viewButton of viewButtons) {
        await page.getByRole("button", { name: "view" }).first().click();
      }
      const likeButtons = await page.getByText("like").all();

      for (let i = 0; i < 3; i++) {
        await likeButtons[0].click();
        await page.waitForResponse(
          (response) =>
            response.url().includes("/api/blogs") &&
            response.status() === 200 &&
            response.request().method() === "GET"
        );
      }

      for (let i = 0; i < 5; i++) {
        await likeButtons[1].click();
        await page.waitForResponse(
          (response) =>
            response.url().includes("/api/blogs") &&
            response.status() === 200 &&
            response.request().method() === "GET"
        );
      }

      await expect(
        await page.getByText("likes 3", { exact: false })
      ).toBeVisible();
      await expect(
        await page.getByText("likes 5", { exact: false })
      ).toBeVisible();

      const blogs = await page.locator(".blog").all();

      await expect(blogs[0]).toContainText("second blog");
    });
  });
});
