const { Client } = require("pg");

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  try {
    await client.connect();
    await client.query("DELETE FROM customers WHERE email IS NOT NULL");
    console.log("Deleted existing customers with email.");

    const res = await client.query(
      "INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email",
      ["Demo User", "demo@tiendaflow.com", "+1234567890"]
    );
    console.log("Inserted demo user:", res.rows[0].id, "-", res.rows[0].name, "<" + res.rows[0].email + ">");

    const res2 = await client.query(
      "INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email",
      ["Admin", "admin@tiendaflow.com", "+1987654321"]
    );
    console.log("Inserted admin:", res2.rows[0].id, "-", res2.rows[0].name, "<" + res2.rows[0].email + ">");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

seed().catch(console.error);


