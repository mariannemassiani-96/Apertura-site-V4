const argon2 = require("argon2");

(async () => {
  const hash = await argon2.hash("Test123!");
  console.log("HASH =", hash);
  console.log("VERIFY =", await argon2.verify(hash, "Test123!"));
})();
