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
                                        person ON park.id_person = person.id_person
                                      order by start desc;`);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ desc: "Data log failed" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params; // Extract 'name' directly from 'req.params'
    try {
      const result = await pool.query(`SELECT * FROM person WHERE id_person =  $1;`, [id]); // Pass the correct value
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ desc: "Get data failed" }); // Corrected error desc
    }
  });


router.post("/", async (req, res) => {
    const { license } = req.body;

    if (!license) {
        return res.status(400).json({ desc: "License plate is required" });
    }

    try {
        // ตรวจสอบว่ามีข้อมูลใน person หรือไม่
        const personResult = await pool.query(
        `SELECT id_person FROM person WHERE license = $1`,
        [license]
        );

        if (personResult.rows.length === 0) {
        return res.status(404).json({ desc: "License not found in person table" });
        }

        const id_person = personResult.rows[0].id_person;

        // ตรวจสอบว่าป้ายทะเบียนนี้ยังไม่ได้ออก
        const parkResult = await pool.query(
        `SELECT park_out FROM park WHERE license = $1 AND park_out IS NULL`,
        [license]
        );

        if (parkResult.rows.length > 0) {
        return res.status(400).json({ desc: "This license plate is already parked" });
        }

        // เพิ่มข้อมูลใหม่
        await pool.query(
        `INSERT INTO park (id_person, license, park_in, park_out) VALUES ($1, $2, NOW(), NULL)`,
        [id_person, license]
        );

        res.status(201).json({ desc: "Data inserted successfully" });

    } catch (error) {
        res.status(500).json({ desc: "Data insertion failed"});
    }
});

router.put("/", async (req, res) => {
    const { license } = req.body;
  
    if (!license) {
      return res.status(400).json({ desc: "License plate is required" });
    }
  
    try {
      // อัปเดตเวลาที่จอดออก
      const result = await pool.query(
        `UPDATE park SET park_out = NOW() WHERE license = $1 AND park_out IS NULL`,
        [license]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ desc: "No active parking record found for this license plate" });
      }
  
      res.status(200).json({ desc: "Park out time updated successfully" });
  
    } catch (error) {
      res.status(500).json({ desc: "Update failed"});
    }
  });


module.exports = router;