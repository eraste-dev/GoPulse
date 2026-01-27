"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seeding...');
    await prisma.pingReport.deleteMany();
    await prisma.monitor.deleteMany();
    await prisma.user.deleteMany();
    const admin = await prisma.user.create({
        data: {
            email: 'admin@gopulse.com',
            password: 'setup_password_hash_here',
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
    for (const monitor of admin.monitors) {
        console.log(`📊 Generating reports for ${monitor.name}...`);
        for (let i = 0; i < 50; i++) {
            const status = faker_1.faker.helpers.arrayElement(['UP', 'UP', 'UP', 'UP', 'DOWN']);
            const responseTime = status === 'UP'
                ? faker_1.faker.number.int({ min: 20, max: 500 })
                : 0;
            await prisma.pingReport.create({
                data: {
                    monitorId: monitor.id,
                    status: status,
                    statusCode: status === 'UP' ? 200 : faker_1.faker.helpers.arrayElement([500, 503, 404]),
                    responseTime: responseTime,
                    region: faker_1.faker.helpers.arrayElement(monitor.regions),
                    timestamp: faker_1.faker.date.recent({ days: 1 }),
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
//# sourceMappingURL=seed.js.map