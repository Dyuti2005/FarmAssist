const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, phone, password, role, language } = req.body;

        if (!name || !phone || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this phone number" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                passwordHash,
                role,
                language: language || 'en'
            }
        });

        // Create associated profile based on role
        if (role === 'FARMER') {
            await prisma.farmerProfile.create({ data: { userId: user.id } });
        } else if (role === 'BUYER') {
            await prisma.buyerProfile.create({ data: { userId: user.id } });
        }

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: "Missing phone or password" });
        }

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
