import request from 'supertest';
import app from '../src/index.js';

describe('Submissions', () => {
  it('health endpoint works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

