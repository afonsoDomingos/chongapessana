const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createStudent = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        let student = await User.findOne({ email: 'cliente@chongapesssana.com' });

        if (!student) {
            console.log('Creating new student...');
            student = new User({
                name: 'Exemplo Cliente',
                email: 'cliente@chongapesssana.com',
                password: '@Cliente123@',
                role: 'student'
            });
        } else {
            console.log('Updating existing student...');
            student.password = '@Cliente123@';
            student.role = 'student';
        }

        await student.save();
        console.log('Success: Student active with email cliente@chongapesssana.com and password @Cliente123@');
        process.exit(0);
    } catch (err) {
        console.error('Error detail:', err);
        process.exit(1);
    }
};

createStudent();
