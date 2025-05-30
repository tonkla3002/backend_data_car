const express = require("express");
const router = express.Router();
const pool = require("../pool");


router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM person;`);
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
    const { firstname, lastname, department, license, brand, model, color, startDate, endDate} = req.body;
    // const finalDepartment = department === 'Other' ? newInput : department;
  
    try {
      // Correct SQL query syntax
      const query = `INSERT INTO person (firstname, lastname, license, department, brand, model, color, start_at, end_at) 
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
      // Await the database query
      await pool.query(query, [firstname, lastname, license, department, brand, model, color, startDate, endDate]);
  
      res.status(201).json({
        message: "Data inserted successfully"
      });

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