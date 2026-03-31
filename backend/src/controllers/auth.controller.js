import pool from '../config/db.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth.js';

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND is_active = true',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const register = async (req, res) => {
    const { username, email, password, full_name, role } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, full_name, role`,
            [username, email, hashedPassword, full_name, role]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: newUser
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, message: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { login, register };