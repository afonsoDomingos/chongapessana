const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        let admin = await User.findOne({ email: 'admin@chongapessana.com' });

        if (!admin) {
            console.log('Creating new admin...');
            admin = new User({
                name: 'Chonga Pessana Admin',
                email: 'admin@chongapessana.com',
                password: '@Admin123@',
                role: 'admin'
            });
        } else {
            console.log('Updating existing admin...');
            admin.password = '@Admin123@';
            admin.role = 'admin'; // Ensure role is admin
        }

        await admin.save();
        console.log('Success: Admin active with email admin@chongapessana.com and password @Admin123@');
        process.exit(0);
    } catch (err) {
        console.error('Error detail:', err);
        process.exit(1);
    }
};

createAdmin();
