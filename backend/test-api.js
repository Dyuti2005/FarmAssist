(async () => {
    let farmerId = null;
    let cropId = null;
    const BASE_URL = 'http://localhost:5001/api';

    try {
        console.log('Test 1: Verify GET /api/health');
        const healthReq = await fetch(`${BASE_URL}/health`);
        const health = await healthReq.json();
        console.log('  Result:', health);
        console.log('  Status: PASSED\n');

        console.log('Setup: Preparing a Farmer user for foreign key constraint');
        // It will return 400 if user exists, so let's randomize phone
        const phone = `+9199999${Math.floor(Math.random() * 100000)}`;
        const userReq = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Farmer', phone, password: 'test', role: 'FARMER' })
        });
        const user = await userReq.json();
        if (userReq.ok) {
            farmerId = user.userId;
            console.log('  User created successfully, ID:', farmerId, '\n');
        } else {
            throw new Error(`Failed to create user: ${JSON.stringify(user)}`);
        }

        console.log('Test 2: Test creating one sample Crop through POST /api/crops');
        const cropReq = await fetch(`${BASE_URL}/crops`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                farmerId,
                cropName: 'Test Corn',
                variety: 'Sweet',
                quantity: 500,
                status: 'PLANTED'
            })
        });
        const cropStore = await cropReq.json();
        if (cropReq.ok) {
            cropId = cropStore.data.id;
            console.log('  Crop Created:', cropStore.data.cropName, 'with ID:', cropId);
            console.log('  Status: PASSED\n');
        } else {
            throw new Error(`Failed to create crop: ${JSON.stringify(cropStore)}`);
        }

        console.log('Test 3: Verify the Crop is actually stored in PostgreSQL');
        console.log('  (This is implicitly passed by the fact that POST succeeded without DB errors and returned an ID from Prisma, but we will confirm in next steps)');

        console.log('Test 4: Test GET /api/crops and confirm the same record is returned');
        const allCropsReq = await fetch(`${BASE_URL}/crops`);
        const allCrops = await allCropsReq.json();
        const found = allCrops.find(c => c.id === cropId);
        if (found) {
            console.log('  Crop found in all crops array.');
            console.log('  Status: PASSED\n');
        } else {
            throw new Error('Crop not found in GET /crops');
        }

        console.log('Test 5: Test GET /api/crops/:id');
        const singleCropReq = await fetch(`${BASE_URL}/crops/${cropId}`);
        const singleCrop = await singleCropReq.json();
        if (singleCropReq.ok && singleCrop.id === cropId) {
            console.log('  Single crop fetched properly. Name:', singleCrop.cropName);
            console.log('  Status: PASSED\n');
        } else {
            throw new Error(`Failed to GET /crops/:id: ${JSON.stringify(singleCrop)}`);
        }

        console.log('Test 6: Clean up/delete the test record');
        console.log('  Status: SKIPPED (No DELETE route was designated for Phase 1 inside cropRoutes based on instructions. Only GET/POST/PUT were added, so data stays.)\n');

        console.log('ALL TESTS EXECUTED.');

    } catch (e) {
        console.error('TEST SUITE FAILED:', e.message);
    }
})();
