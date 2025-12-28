const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const courses = [
            {
                title: { pt: 'Curso de Fotografia', en: 'Photography Course' },
                description: {
                    pt: 'Aprenda as técnicas essenciais de composição, iluminação e edição cinematográfica.',
                    en: 'Learn essential techniques of composition, lighting, and cinematic editing.'
                },
                price: 999,
                currency: 'MT',
                status: 'active',
                imageUrl: '/images/hero.jpg'
            },
            {
                title: { pt: 'Curso DE Skate', en: 'Skate Course' },
                description: {
                    pt: 'Brevemente anunciado. Técnica de filmagem e fotografia de skate de alto nível.',
                    en: 'Coming soon. High-level skate filming and photography techniques.'
                },
                price: 999,
                currency: 'MT',
                status: 'announced',
                startDate: '25 de Janeiro',
                imageUrl: '/images/skate-course.png'
            }
        ];

        for (const c of courses) {
            await Course.findOneAndUpdate({ 'title.pt': c.title.pt }, c, { upsert: true, new: true });
        }

        console.log('Courses seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding courses:', err);
        process.exit(1);
    }
};

seedCourses();
