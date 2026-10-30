const { Client } = require("pg");
async function check() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  try {
    await client.connect();
    const res = await client.query("SELECT id, email, password_hash FROM users");
    console.log("Users in DB:", res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}
check();
