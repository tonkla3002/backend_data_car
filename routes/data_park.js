const express = require("express");
const router = express.Router();
const pool = require("../pool");


router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`SELECT 
                                        park.id_park,
                                        park.park_in AS start,
                                        park.park_out AS end,
                                        park.license,
                                        person.id_person,
                                        person.firstname,
                                        person.lastname,
                                        person.department,
                                        person.brand,
                                        person.model,
                                        person.color
                                    FROM 
                                        park
                                    LEFT JOIN 
                                        person ON park.id_person = person.id_person;`);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Data log failed" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params; // Extract 'name' directly from 'req.params'
    try {
      const result = await pool.query(`SELECT * FROM person WHERE id_person =  $1;`, [id]); // Pass the correct value
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Get data failed" }); // Corrected error message
    }
  });


router.post("/", async (req, res) => {
    const { license } = req.body;

    if (!license) {
        return res.status(400).json({ error: "License plate is required" });
    }

    try {
        // ตรวจสอบว่ามีข้อมูลใน person หรือไม่
        const personResult = await pool.query(
        `SELECT id_person FROM person WHERE license = $1`,
        [license]
        );

        if (personResult.rows.length === 0) {
        return res.status(404).json({ error: "License not found in person table" });
        }

        const id_person = personResult.rows[0].id_person;

        // ตรวจสอบว่าป้ายทะเบียนนี้ยังไม่ได้ออก
        const parkResult = await pool.query(
        `SELECT park_out FROM park WHERE license = $1 AND park_out IS NULL`,
        [license]
        );

        if (parkResult.rows.length > 0) {
        return res.status(400).json({ error: "This license plate is already parked" });
        }

        // เพิ่มข้อมูลใหม่
        await pool.query(
        `INSERT INTO park (id_person, license, park_in, park_out) VALUES ($1, $2, NOW(), NULL)`,
        [id_person, license]
        );

        res.status(201).json({ message: "Data inserted successfully" });

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Data insertion failed", error: error.message });
    }
});
  

router.put("/", async (req, res) => {
    let { id, startDate, endDate } = req.body;
  
    try {
      // ปรับเวลาให้กลางวัน ป้องกันวันที่ลดลงจาก timezone
      const normalizeDate = (date) => {
        if (!date || date === "") return null;
        const d = new Date(date);
        d.setHours(12, 0, 0, 0); // ตั้งเป็นเที่ยงวัน
        return d.toISOString(); // ใช้รูปแบบที่ PostgreSQL เข้าใจ
      };
  
      const fixedStartDate = normalizeDate(startDate);
      const fixedEndDate = normalizeDate(endDate);
  
      const query = `
        UPDATE person 
        SET created_at = NOW(), start_at = $1, end_at = $2 
        WHERE id_person = $3;
      `;
  
      const result = await pool.query(query, [fixedStartDate, fixedEndDate, id]);
  
      if (result.rowCount > 0) {
        res.json({ message: "Update Done" });
      } else {
        res.status(404).json({ message: "Not found data" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Update error !!!" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params; // Extract 'name' directly from 'req.params'
    try {
        const result = await pool.query(`DELETE FROM person WHERE id_person =  $1;`, [id]); // Pass the correct value
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Delete data failed" }); // Corrected error message
    }
});


module.exports = router;