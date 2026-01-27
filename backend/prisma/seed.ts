
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Clean database
    await prisma.pingReport.deleteMany();
    await prisma.monitor.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Admin User
    const admin = await prisma.user.create({
        data: {
            email: 'admin@gopulse.com',
            password: 'setup_password_hash_here', // In prod, use bcrypt
            name: 'GoPulse Admin',
            monitors: {
                create: [
                    {
                        name: 'Google Search',
                        url: 'https://google.com',
                        interval: 60,
                        regions: ['us-east', 'eu-west'],
                    },
                    {
                        name: 'Local API',
                        url: 'http://localhost:3001/api',
                        interval: 30,
                        regions: ['local'],
                    },
                ],
            },
        },
        include: {
            monitors: true,
        },
    });

    console.log(`👤 Created admin user: ${admin.email}`);

    // 3. Generate Reports for each Monitor
    for (const monitor of admin.monitors) {
        console.log(`📊 Generating reports for ${monitor.name}...`);

        // Generate 50 reports over the last 24 hours
        for (let i = 0; i < 50; i++) {
            const status = faker.helpers.arrayElement(['UP', 'UP', 'UP', 'UP', 'DOWN']); // 80% UP
            const responseTime = status === 'UP'
                ? faker.number.int({ min: 20, max: 500 })
                : 0;

            await prisma.pingReport.create({
                data: {
                    monitorId: monitor.id,
                    status: status,
                    statusCode: status === 'UP' ? 200 : faker.helpers.arrayElement([500, 503, 404]),
                    responseTime: responseTime,
                    region: faker.helpers.arrayElement(monitor.regions),
                    timestamp: faker.date.recent({ days: 1 }),
                }
            });
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
