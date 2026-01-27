"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seeding...');
    await prisma.pingReport.deleteMany();
    await prisma.monitor.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.userRole.deleteMany();
    const admin = await prisma.user.create({
        data: {
            email: 'admin@gopulse.com',
            password: 'setup_password_hash_here',
            name: 'GoPulse Admin',
            status: 'ACTIVE',
            role: {
                create: {
                    slug: 'admin',
                    name: 'Administrator',
                    isDefault: true
                }
            },
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
    await prisma.user.create({
        data: {
            email: 'demo@kt.com',
            password: 'setup_password_hash_here',
            name: 'Demo User',
            status: 'ACTIVE',
            role: {
                connect: { slug: 'admin' }
            }
        }
    });
    console.log(`👤 Created users: ${admin.email}, demo@kt.com`);
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