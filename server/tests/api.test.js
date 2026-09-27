const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const seedDemoData = require('../src/scripts/seed-demo-data');

beforeAll(async () => {
  await connectDB();
  await seedDemoData({ silentIfPopulated: false });
});

afterAll(async () => {
  await disconnectDB();
});

describe('LabhSetu API Endpoints Integration Tests', () => {
  let authToken = '';

  test('GET /api/health returns 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('POST /api/auth/login logs in demo citizen user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen@labhsetu.gov.in', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('citizen');
    authToken = res.body.token;
  });

  test('GET /api/schemes returns published schemes with pagination', async () => {
    const res = await request(app).get('/api/schemes');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.schemes.length).toBeGreaterThan(0);
  });

  test('POST /api/eligibility/check evaluates schemes against profile payload', async () => {
    const res = await request(app)
      .post('/api/eligibility/check')
      .send({
        profile: {
          isFarmer: true,
          annualIncome: 180000,
          state: 'Uttar Pradesh',
          residenceType: 'rural',
          age: 38,
        },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results.potentiallyEligible.length).toBeGreaterThan(0);
  });

  test('POST /api/assistant/query returns grounded scheme response with citations', async () => {
    const res = await request(app)
      .post('/api/assistant/query')
      .send({ query: 'What documents are required for PM-KISAN scheme?' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toBeDefined();
    expect(res.body.data.sources.length).toBeGreaterThan(0);
  });
});
