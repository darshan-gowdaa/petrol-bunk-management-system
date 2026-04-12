// Usage: node generateHash.js <password>
// Or: ADMIN_PASSWORD=your-password node generateHash.js
import bcrypt from "bcryptjs";

const password = process.argv[2] || process.env.ADMIN_PASSWORD || "admin";
const saltRounds = 10;

if (password === "admin" && !process.argv[2] && !process.env.ADMIN_PASSWORD) {
  console.warn("⚠️  WARNING: Using default password 'admin'. This is INSECURE for production!");
  console.warn("Usage: node generateHash.js <your-secure-password>");
  console.warn("Or: ADMIN_PASSWORD=your-password node generateHash.js\n");
}

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
    process.exit(1);
  }
  console.log("Generated bcrypt hash:");
  console.log(hash);
  console.log("\nCopy this hash to your .env file as ADMIN_PASSWORD_HASH");
});
