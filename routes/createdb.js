const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/", async (req, res) => {
  try {
    const queries = [
      `CREATE TABLE IF NOT EXISTS public.admin (
        username TEXT COLLATE pg_catalog."default",
        password TEXT COLLATE pg_catalog."default"
      );`,
      `ALTER TABLE IF EXISTS public.admin OWNER TO postgres;`,

      `CREATE TABLE IF NOT EXISTS public.person (
        id_person SERIAL PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        license VARCHAR(20) NOT NULL UNIQUE,
        department VARCHAR(100),
        brand VARCHAR(50),
        model VARCHAR(50),
        color VARCHAR(30),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        start_at TIMESTAMPTZ,
        end_at TIMESTAMPTZ
      );`,
      `ALTER TABLE IF EXISTS public.person OWNER TO postgres;`,

      `CREATE TABLE IF NOT EXISTS public.park (
        id_park SERIAL PRIMARY KEY,
        id_person INTEGER NOT NULL,
        license VARCHAR(20) NOT NULL,
        park_in TIMESTAMPTZ NOT NULL,
        park_out TIMESTAMPTZ,
        UNIQUE (license, park_in),
        CONSTRAINT park_id_person_fkey FOREIGN KEY (id_person)
          REFERENCES public.person (id_person)
          ON DELETE CASCADE
      );`,
      `ALTER TABLE IF EXISTS public.park OWNER TO postgres;`
    ];

    for (const query of queries) {
      await pool.query(query);
    }

    res.status(201).json({ desc: "Create database successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ desc: "Create database failed" });
  }
});

module.exports = router;
