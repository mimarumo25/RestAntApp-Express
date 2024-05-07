import { pool } from "../database/database.js"


export const getEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');
        if (rows.length === 0) {
            res.status(404).send({ error: 'No employees found' });
        } else {
            res.send(rows);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const getEmployeeById = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])
    if (rows.length <= 0) return res.status(404).json({ message: 'Employee Not Found ID: ' + req.params.id })
    res.send(rows[0])
}
export const createEmployee = async (req, res) => {
    const { name, salary } = req.body;
    const [rows] = await pool.query('INSERT INTO employee(name, salary) VALUES (?, ?)', [name, salary])

    res.send({
        id: rows.insertId,
        name,
        salary
    })
}
export const updateEmployee = async (req, res) => {
    const { id } = req.params
    const { name, salary } = req.body
    const [result] = await pool.query("UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id =?", [name, salary, id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee Not Found ID: ' + req.params.id })

    const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])
    res.send(rows[0])
}

export const deleteEmployee = async (req, res) => {
    const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [req.params.id])

    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Employee Not Found ID: ' + req.params.id })
    res.sendStatus(204)
}