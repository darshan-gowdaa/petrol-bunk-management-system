import bcrypt from "bcryptjs";

const password = "admin";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
    return;
  }
  console.log("Generated hash:", hash);
});
