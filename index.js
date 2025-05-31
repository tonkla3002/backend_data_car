require("dotenv").config();
const express = require("express");
const cors = require("cors");

const data_carRouter = require("./routes/data_car");
const data_parkRouter = require("./routes/data_park");
const adminRouter = require("./routes/admin");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Hee Pin");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(`CREATE TABLE IF NOT EXISTS public.admin
                    (
                        username text COLLATE pg_catalog."default",
                        password text COLLATE pg_catalog."default"
                    )

                    TABLESPACE pg_default;

                    ALTER TABLE IF EXISTS public.admin
                        OWNER to postgres;
                        
                        CREATE TABLE IF NOT EXISTS public.park
                    (
                        id_park integer NOT NULL DEFAULT nextval('park_id_park_seq'::regclass),
                        id_person integer NOT NULL,
                        license character varying(20) COLLATE pg_catalog."default" NOT NULL,
                        park_in timestamp with time zone NOT NULL,
                        park_out timestamp with time zone,
                        CONSTRAINT park_pkey PRIMARY KEY (id_park),
                        CONSTRAINT park_license_park_in_key UNIQUE (license, park_in),
                        CONSTRAINT park_id_person_fkey FOREIGN KEY (id_person)
                            REFERENCES public.person (id_person) MATCH SIMPLE
                            ON UPDATE NO ACTION
                            ON DELETE CASCADE
                    )

                    TABLESPACE pg_default;

                    ALTER TABLE IF EXISTS public.park
                        OWNER to postgres;
                        
                    CREATE TABLE IF NOT EXISTS public.person
                  (
                      id_person integer NOT NULL DEFAULT nextval('person_id_person_seq'::regclass),
                      firstname character varying(100) COLLATE pg_catalog."default" NOT NULL,
                      lastname character varying(100) COLLATE pg_catalog."default" NOT NULL,
                      license character varying(20) COLLATE pg_catalog."default" NOT NULL,
                      department character varying(100) COLLATE pg_catalog."default",
                      brand character varying(50) COLLATE pg_catalog."default",
                      model character varying(50) COLLATE pg_catalog."default",
                      color character varying(30) COLLATE pg_catalog."default",
                      created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                      start_at timestamp with time zone,
                      end_at timestamp with time zone,
                      CONSTRAINT person_pkey PRIMARY KEY (id_person),
                      CONSTRAINT person_license_key UNIQUE (license)
                  )

                  TABLESPACE pg_default;

                  ALTER TABLE IF EXISTS public.person
                      OWNER to postgres;    
                        `);
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.use("/data_car", data_carRouter);
app.use("/data_park", data_parkRouter);
app.use("/admin", adminRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
