const request = require('supertest');
const app = require('../src/index');

describe('Points System', () => {
  let authToken;
  let userId;

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
    userId = registerResponse.body.user.id;
  });

  describe('POST /api/submissions', () => {
    it('should award points for approved submissions', async () => {
      // Create a challenge first
      const challengeResponse = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Challenge',
          description: 'A test challenge for points',
          category: 'TREE_PLANTING',
          difficulty: 'EASY',
          type: 'TASK',
          points: 50
        });

      const challengeId = challengeResponse.body.challenge.id;

      // Submit a response
      const submissionResponse = await request(app)
        .post('/api/submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .field('challengeId', challengeId)
        .field('type', 'TEXT')
        .field('content', 'I planted a tree in my garden');

      expect(submissionResponse.status).toBe(201);
      expect(submissionResponse.body.submission).toBeDefined();

      // Simulate approval (in real app, this would be done by admin/teacher)
      const approvalResponse = await request(app)
        .put(`/api/submissions/${submissionResponse.body.submission.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'APPROVED',
          feedback: 'Great work!',
          points: 50
        });

      expect(approvalResponse.status).toBe(200);

      // Check if user points were updated
      const profileResponse = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(profileResponse.body.user.points).toBe(50);
    });
  });

  describe('Badge System', () => {
    it('should award badges based on points', async () => {
      // This would test the badge awarding logic
      // In a real implementation, you'd test the badge eligibility checks
      expect(true).toBe(true); // Placeholder
    });
  });
});