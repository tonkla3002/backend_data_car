const express = require("express");
const router = express.Router();
const pool = require("../pool");


router.post("/", async (req, res) => {
    try {
      // Correct SQL query syntax
      const query = `CREATE TABLE IF NOT EXISTS public.admin
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
                        `;
      // Await the database query
      await pool.query(query);
  
      res.status(201).json({
        desc: "Create database successfully"
      });

    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ desc: "Create database  failed"});
    }
});


module.exports = router;