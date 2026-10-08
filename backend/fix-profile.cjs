const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProfile() {
    await prisma.farmerProfile.updateMany({
        where: { farmLocation: null },
        data: { farmLocation: 'Sehore, Madhya Pradesh' }
    });
    console.log("Updated farmer profile locations.");
}

fixProfile().finally(() => prisma.$disconnect());
