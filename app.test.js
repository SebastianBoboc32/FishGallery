const request = require('supertest');
const app = require('./app'); 

describe('Fish API tests', () => {
    // Test retrieving all fish
    test('GET /fish should return all fish', async () => {
        const response = await request(app).get('/fish');
        //console.log(response);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // Test adding a new fish
    test('POST /fish should add a new fish', async () => {
        const newFish = {
            id: "7", 
            name: "Clownfish",
            origin: "Pacific Ocean",
            species: "Amphiprioninae",
            beauty_score: 8.5
        };
        const response = await request(app)
            .post('/fish')
            .send(newFish);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Fish added successfully");
    });

    // Test updating an existing fish
    test('PUT /fish/:fishId should update a fish', async () => {
        const updatedFishDetails = {
            name: "Updated Clownfish",
            origin: "Updated Pacific Ocean",
            species: "Updated Amphiprioninae",
            beauty_score: 9.0
        };
        const response = await request(app)
            .put('/fish/2') 
            .send(updatedFishDetails);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Fish 2 updated successfully");
    });

    // Test deleting an existing fish
    test('DELETE /fish/:fishId should delete a fish', async () => {
        const response = await request(app).delete('/fish/349d4407-94d0-41b0-bdc8-b69a807f2d2f');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Deleted fish 4");
    });

    // Test retrieving a specific fish by ID
    test('GET /fish/:fishId should return a specific fish', async () => {
        const response = await request(app).get('/fish/10351890-7712-4319-9a2a-7dabc6fb1ff8'); 
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', '10351890-7712-4319-9a2a-7dabc6fb1ff8');
    });
});

describe('Fish Tanks API tests', () => {
    // Test retrieving all fish tanks
    test('GET /fishTanks should return all fish tanks', async () => {
        const response = await request(app).get('/fish_tanks');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // Test adding a new fish tank
    test('POST /fishTanks should add a new fish tank', async () => {
        const newFishTank = {
            TicketPrice: 15,
            location: "Sea World",
            reviews: 4.5
        };
        const response = await request(app)
            .post('/fish_tanks')
            .send(newFishTank);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual("Fish tank added successfully");
    });

    // Test updating an existing fish tank
    test('PUT /fishTanks/:tankId should update a fish tank', async () => {
        const updatedFishTankDetails = {
            TicketPrice: 20,
            location: "Updated Sea World",
            reviews: 4.9
        };
        const response = await request(app)
            .put('/fish_tanks/2') // Assuming '2' is a valid tank ID for the purpose of this example.
            .send(updatedFishTankDetails);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Fish tank 2 updated successfully");
    });

    // Test deleting an existing fish tank
    test('DELETE /fishTanks/:tankId should delete a fish tank', async () => {
        const response = await request(app).delete('/fish_tanks/60e880c0-7d1a-402c-952d-9b74b9759245');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Deleted fish tank with ID 60e880c0-7d1a-402c-952d-9b74b9759245");
    });

    // Test retrieving a specific fish tank by ID
    test('GET /fishTanks/:tankId should return a specific fish tank', async () => {
        const response = await request(app).get('/fish_tanks/0f28915e-5c14-454f-915a-44bfdb349ef2');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', '0f28915e-5c14-454f-915a-44bfdb349ef2');
    });
});