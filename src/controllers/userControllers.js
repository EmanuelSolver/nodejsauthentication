import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
};


export const register = async (req, res) => {
    const { userName, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('userName', sql.VarChar, userName)
            .query('SELECT * FROM mytable WHERE userName = @userName');
        
        const user = result.recordset[0];
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else {
            await pool.request()
                .input('userName', sql.VarChar, userName)
                .input('hashedpassword', sql.VarChar, hashedPassword)
                .input('email', sql.VarChar, email)
              
                .query('INSERT INTO mytable ( userName, mail, password) VALUES (@userName, @email, @hashedPassword)');
            res.status(200).send({ message: 'User created successfully' });
        }

    } catch (error) {

        res.status(500).json({ error: 'An error occurred while creating the user' });
    } finally {

        sql.close();
    }

};

export const login = async (req, res) => {
    const { userName, password } = req.body;
    let pool = await sql.connect(config.sql);

    const result = await pool.request()
        .input('userName', sql.VarChar, userName)
        .query('SELECT * FROM mytable WHERE userName = @userName');

    const user = result.recordset[0];
  
    if (!user) {

        res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
    } 
    else {

        if (!bcrypt.compareSync(password, user.password)) {

            res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
        } else {

            const token = `JWT ${jwt.sign({ userName: user.userName, mail: user.mail }, config.jwt_secret)}`;
            res.status(200).json({ mail: user.mail, userName: user.userName, id: user.id, token: token });
        }
    }
};

// export const register = async (req, res) => {
//     const { regNo, studentEmail, studentName, deptId, courseId, password} = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     try {
//         let pool = await sql.connect(config.sql);
//         const result = await pool.request()
//             .input('regNo', sql.VarChar, regNo)
//             .query('SELECT * FROM StudentsData WHERE RegNo = @regNo OR StudentMail = @studentEmail');
        
//             const user = result.recordset[0];
//         if (user) {
//             res.status(409).json({ error: 'User already exists' });
//         } else {
//             await pool.request()
//                 .input('regNo', sql.VarChar, regNo)
//                 .input('hashedpassword', sql.VarChar, hashedPassword)
//                 .input('studentEmail', sql.VarChar, studentEmail)
//                 .input('studentName', sql.VarChar, studentName)
//                 .input('courseId', sql.Int, courseId)
//                 .input('deptId', sql.Int, deptId)
//                 .query('INSERT INTO StudentsData (RegNo, StudentName, StudentMail, Password, DeptID, CourseID) VALUES (@regNo, @studentName, @studentEmail, @hashedPassword, @deptId, @courseId)');
//             res.status(200).send({ message: 'User created successfully' });
//         }

//     } catch (error) {

//         res.status(500).json({ error: 'An error occurred while creating the user' });
//     } finally {

//         sql.close();
//     }

// };

// export const login = async (req, res) => {
//     const { regNo, password } = req.body;
//     let pool = await sql.connect(config.sql);

//     const result = await pool.request()
//         .input('regNo', sql.VarChar, regNo)
//         .query('SELECT * FROM StudentsData WHERE RegNo = @regNo');

//     const user = result.recordset[0];
//     if (!user) {
//         res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
//     } else {
//         if (!bcrypt.compareSync(password, user.hashedpassword)) {
//             res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
//         } else {
//             const token = `JWT ${jwt.sign({ username: user.username, email: user.email }, config.jwt_secret)}`;
//             res.status(200).json({ email: user.email, username: user.username, id: user.id, token: token });
//         }
//     }

// };