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


// export const register = async (req, res) => {
//     const { userName, email, password} = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     try {
//         let pool = await sql.connect(config.sql);
//         const result = await pool.request()
//             .input('userName', sql.VarChar, userName)
//             .query('SELECT * FROM mytable WHERE userName = @userName');
        
//         const user = result.recordset[0];
//         if (user) {
//             res.status(409).json({ error: 'User already exists' });
//         } else {
//             await pool.request()
//                 .input('userName', sql.VarChar, userName)
//                 .input('hashedpassword', sql.VarChar, hashedPassword)
//                 .input('email', sql.VarChar, email)
              
//                 .query('INSERT INTO mytable ( userName, mail, password) VALUES (@userName, @email, @hashedPassword)');
//             res.status(200).send({ message: 'User created successfully' });
//         }

//     } catch (error) {

//         res.status(500).json({ error: 'An error occurred while creating the user' });
//     } finally {

//         sql.close();
//     }

// };

// export const login = async (req, res) => {
//     const { userName, password } = req.body;
//     let pool = await sql.connect(config.sql);

//     const result = await pool.request()
//         .input('userName', sql.VarChar, userName)
//         .query('SELECT * FROM mytable WHERE userName = @userName');

//     const user = result.recordset[0];
  
//     if (!user) {

//         res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
//     } 
//     else {

//         if (!bcrypt.compareSync(password, user.password)) {

//             res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
//         } else {

//             const token = `JWT ${jwt.sign({ userName: user.userName, mail: user.mail }, config.jwt_secret)}`;
//             res.status(200).json({ mail: user.mail, userName: user.userName, id: user.id, token: token });
//         }
//     }
// };

export const register = async (req, res) => {
    const { regNo, studentEmail, studentName, deptId, courseId, password, nationalId, phoneNo, image, regDate} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('regNo', sql.VarChar, regNo)
            .query('SELECT * FROM StudentsData WHERE RegNo = @regNo');
        
            const user = result.recordset[0];
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else {
            await pool.request()
                .input('regNo', sql.VarChar, regNo)
                .input('studentName', sql.VarChar, studentName)
                .input('mail', sql.VarChar, studentEmail)
                .input('hashedpassword', sql.VarChar, hashedPassword)
                .input('courseId', sql.Int, courseId)
                .input('deptId', sql.Int, deptId)
                .input('nationalId', sql.Int, nationalId)
                .input('image', sql.VarChar, image)
                .input('phoneNo', sql.VarChar, phoneNo)
                .input('regDate', sql.VarChar, regDate)
                .query('INSERT INTO StudentsData (RegNo, StudentName, StudentMail, PhoneNumber, NationalID, ProfileImage, RegistrationDate, Password, DeptID, CourseID) VALUES (@regNo, @studentName, @mail, @phoneNo, @nationalId, @image, @regDate,  @hashedPassword, @deptId, @courseId)');
            res.status(200).send({ message: 'User created successfully' });
        }

    } catch (error) {

        res.status(500).json({ error});
    } finally {

        sql.close();
    }

};

export const login = async (req, res) => {
    const { regNo, password } = req.body;
    let pool = await sql.connect(config.sql);

    const result = await pool.request()
        .input('regNo', sql.VarChar, regNo)
        .query('SELECT * FROM StudentsData WHERE RegNo = @regNo');

    const user = result.recordset[0];
    if (!user) {
        res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
    } else {
        if (!bcrypt.compareSync(password, user.Password)) {
            res.status(401).json({ error: 'Authentication failed. Wrong credentials.' });
        } else {
            const token = `JWT ${jwt.sign({ username: user.StudentName, email: user.StudentMail }, config.jwt_secret)}`;
            res.status(200).json({ email: user.StudentMail, username: user.StudentName, id: user.RegNo, token: token });
        }
    }

};