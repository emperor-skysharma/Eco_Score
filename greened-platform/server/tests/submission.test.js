const request = require('supertest');
const app = require('../src/index');

describe('Submission System', () => {
  let authToken;
  let challengeId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'STUDENT'
      });

    authToken = registerResponse.body.token;

    // Create a test challenge
    const challengeResponse = await request(app)
      .post('/api/challenges')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Challenge',
        description: 'A test challenge',
        category: 'TREE_PLANTING',
        difficulty: 'EASY',
        type: 'TASK',
        points: 50
      });

    challengeId = challengeResponse.body.challenge.id;
  });

  describe('POST /api/submissions', () => {
    it('should create a text submission', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .field('challengeId', challengeId)
        .field('type', 'TEXT')
        .field('content', 'I completed the challenge by planting a tree');

      expect(response.status).toBe(201);
      expect(response.body.submission).toBeDefined();
      expect(response.body.submission.type).toBe('TEXT');
      expect(response.body.submission.content).toBe('I completed the challenge by planting a tree');
    });

    it('should create an image submission', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .field('challengeId', challengeId)
        .field('type', 'IMAGE')
        .attach('file', Buffer.from('fake image data'), 'test.jpg');

      expect(response.status).toBe(201);
      expect(response.body.submission).toBeDefined();
      expect(response.body.submission.type).toBe('IMAGE');
      expect(response.body.submission.imageUrl).toBeDefined();
    });

    it('should reject submission without required fields', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .field('type', 'TEXT');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/submissions/my-submissions', () => {
    it('should return user submissions', async () => {
      const response = await request(app)
        .get('/api/submissions/my-submissions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.submissions).toBeDefined();
      expect(Array.isArray(response.body.submissions)).toBe(true);
    });
  });

  describe('PUT /api/submissions/:id/status', () => {
    let submissionId;

    beforeAll(async () => {
      // Create a submission first
      const submissionResponse = await request(app)
        .post('/api/submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .field('challengeId', challengeId)
        .field('type', 'TEXT')
        .field('content', 'Test submission for status update');

      submissionId = submissionResponse.body.submission.id;
    });

    it('should update submission status', async () => {
      const response = await request(app)
        .put(`/api/submissions/${submissionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'APPROVED',
          feedback: 'Great work!',
          points: 50
        });

      expect(response.status).toBe(200);
      expect(response.body.submission.status).toBe('APPROVED');
    });
  });
});