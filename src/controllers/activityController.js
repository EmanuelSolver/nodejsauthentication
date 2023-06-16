import sql from 'mssql';
import config from '../db/config.js'

export const getAll = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);  //establish a connection to the database
        const result = await pool.request()        // make a request to the database
            .query("SELECT * FROM StudentsData");     // query the employees table in the database

        !result.recordset[0] ? res.status(404).json({ message: 'Record not found' }) // check if there is a record in the table
            : res.status(200).json(result.recordset); // return the result

    } catch (error) {

        res.status(201).json({ error: error.message });
    } finally {

        sql.close(); // Close the SQL connection
    }
};



export const removeStudent = async (req, res) => {
    try {
        const { regNo } = req.body;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM StudentsData WHERE RegNo = ${regNo}`;
        res.status(200).json({ message: 'Record Deleted successfully' });

    } catch (error) {

        res.status(500).json({ error: 'An error occurred while deleting the todo' });
    } finally {

        sql.close();
    }
};


export const getInfo = async(req, res) =>{
    res.send('getting info for a particular person');
}

export const updateInfo = async(req, res) =>{
    res.send('updating particular person');

};