(async () => {
  const { hashPassword, verifyPassword } = await import("./lib/auth/passwords.js");

  const hash = await hashPassword("Test123!");
  console.log("HASH =", hash);
  console.log("VERIFY =", await verifyPassword("Test123!", hash));
})();
