const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const pool = new Pool({
  database: "message_boards",
  host: "localhost",
  port: 5432,
  password: "1234",
  user: "postgres",
});

async function init() {
  const app = express();
  app.use(cors());
  app.use(express.static("static"));
  app.get("/get", async (req, res) => {
    const client = await pool.connect();
    const [commentRes, boardRes] = await Promise.all([
      client.query(
        `SELECT * FROM comments NATURAL LEFT JOIN rich_content WHERE board_id = $1`,
        [req.query.search]
      ),
      client.query(`SELECT * FROM boards WHERE board_id = $1`, [
        req.query.search,
      ]),
    ]);
    res.json({
      status: "ok",
      board: boardRes.rows[0] || {},
      posts: commentRes.rows,
    });
  });
  app.listen(3000, () => console.log("Running on port 3000"));
}

init();
