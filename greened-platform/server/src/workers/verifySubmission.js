const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Mock AI verification worker for image submissions
 * In production, this would integrate with Google Vision API, PlantNet API, etc.
 */
class SubmissionVerifier {
  constructor() {
    this.verificationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Add submission to verification queue
   */
  async queueSubmission(submissionId) {
    try {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { challenge: true, user: true }
      });

      if (!submission) {
        throw new Error('Submission not found');
      }

      this.verificationQueue.push(submission);
      this.processQueue();

      return { success: true, message: 'Submission queued for verification' };
    } catch (error) {
      console.error('Queue submission error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process verification queue
   */
  async processQueue() {
    if (this.isProcessing || this.verificationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.verificationQueue.length > 0) {
      const submission = this.verificationQueue.shift();
      await this.verifySubmission(submission);
    }

    this.isProcessing = false;
  }

  /**
   * Verify a single submission
   */
  async verifySubmission(submission) {
    try {
      console.log(`Verifying submission ${submission.id}...`);

      let verificationResult;

      switch (submission.type) {
        case 'IMAGE':
          verificationResult = await this.verifyImageSubmission(submission);
          break;
        case 'VIDEO':
          verificationResult = await this.verifyVideoSubmission(submission);
          break;
        case 'TEXT':
          verificationResult = await this.verifyTextSubmission(submission);
          break;
        default:
          verificationResult = { verified: false, confidence: 0, feedback: 'Unsupported submission type' };
      }

      // Update submission with verification result
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: verificationResult.verified ? 'APPROVED' : 'REJECTED',
          feedback: verificationResult.feedback,
          verifiedAt: new Date()
        }
      });

      // Award points if verified
      if (verificationResult.verified) {
        await this.awardPoints(submission);
      }

      console.log(`Verification completed for submission ${submission.id}: ${verificationResult.verified ? 'APPROVED' : 'REJECTED'}`);

    } catch (error) {
      console.error(`Verification error for submission ${submission.id}:`, error);
      
      // Mark as needs revision on error
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: 'NEEDS_REVISION',
          feedback: 'Verification failed. Please resubmit with clearer content.'
        }
      });
    }
  }

  /**
   * Verify image submission using mock AI
   */
  async verifyImageSubmission(submission) {
    // Mock verification logic
    // In production, this would use Google Vision API, PlantNet, etc.
    
    const mockVerification = {
      verified: Math.random() > 0.2, // 80% approval rate
      confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
      feedback: ''
    };

    if (mockVerification.verified) {
      mockVerification.feedback = this.generatePositiveFeedback(submission.challenge.category);
    } else {
      mockVerification.feedback = this.generateNegativeFeedback(submission.challenge.category);
    }

    return mockVerification;
  }

  /**
   * Verify video submission
   */
  async verifyVideoSubmission(submission) {
    // Mock video verification
    return {
      verified: Math.random() > 0.3, // 70% approval rate
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      feedback: Math.random() > 0.3 
        ? 'Video shows clear environmental action. Great work!'
        : 'Video quality is unclear. Please resubmit with better lighting and focus.'
    };
  }

  /**
   * Verify text submission
   */
  async verifyTextSubmission(submission) {
    // Basic text analysis
    const content = submission.content || '';
    const wordCount = content.split(' ').length;
    
    // Check for environmental keywords
    const environmentalKeywords = [
      'environment', 'sustainable', 'green', 'eco', 'recycle', 'renewable',
      'energy', 'water', 'waste', 'plant', 'tree', 'biodiversity', 'climate'
    ];
    
    const keywordCount = environmentalKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;

    const verified = wordCount >= 20 && keywordCount >= 2;
    
    return {
      verified,
      confidence: verified ? 0.8 : 0.3,
      feedback: verified 
        ? 'Text submission shows good understanding of environmental concepts.'
        : 'Please provide more detailed description with environmental keywords.'
    };
  }

  /**
   * Award points to user
   */
  async awardPoints(submission) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: submission.userId }
      });

      if (!user) return;

      const pointsToAward = submission.challenge.points;
      const newPoints = user.points + pointsToAward;
      const newLevel = Math.floor(newPoints / 100) + 1;

      await prisma.user.update({
        where: { id: submission.userId },
        data: {
          points: newPoints,
          level: newLevel
        }
      });

      // Check for new badges
      await this.checkBadgeEligibility(submission.userId, newPoints, newLevel);

      console.log(`Awarded ${pointsToAward} points to user ${submission.userId}. New total: ${newPoints}`);

    } catch (error) {
      console.error('Award points error:', error);
    }
  }

  /**
   * Check if user is eligible for new badges
   */
  async checkBadgeEligibility(userId, points, level) {
    try {
      const badges = await prisma.badge.findMany();
      
      for (const badge of badges) {
        const hasBadge = await prisma.userBadge.findUnique({
          where: {
            userId_badgeId: {
              userId,
              badgeId: badge.id
            }
          }
        });

        if (!hasBadge && points >= badge.points) {
          await prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id
            }
          });
          
          console.log(`User ${userId} earned badge: ${badge.name}`);
        }
      }
    } catch (error) {
      console.error('Badge eligibility check error:', error);
    }
  }

  /**
   * Generate positive feedback based on challenge category
   */
  generatePositiveFeedback(category) {
    const feedbacks = {
      TREE_PLANTING: 'Excellent tree planting activity! Your contribution to reforestation is commendable.',
      WASTE_SEGREGATION: 'Great job on waste segregation! You\'re helping create a cleaner environment.',
      ENERGY_CONSERVATION: 'Wonderful energy conservation effort! Every small action counts.',
      WATER_SAVING: 'Outstanding water conservation! You\'re making a real difference.',
      RECYCLING: 'Fantastic recycling initiative! You\'re helping reduce waste effectively.',
      COMPOSTING: 'Excellent composting work! You\'re creating valuable organic matter.',
      CLEANUP_DRIVE: 'Amazing cleanup effort! Your community is cleaner because of you.'
    };

    return feedbacks[category] || 'Great environmental action! Keep up the good work.';
  }

  /**
   * Generate negative feedback based on challenge category
   */
  generateNegativeFeedback(category) {
    const feedbacks = {
      TREE_PLANTING: 'Image doesn\'t clearly show tree planting activity. Please ensure the image shows the actual planting process.',
      WASTE_SEGREGATION: 'Image doesn\'t clearly demonstrate waste segregation. Please show the segregated waste bins or process.',
      ENERGY_CONSERVATION: 'Image doesn\'t clearly show energy conservation activity. Please demonstrate the specific energy-saving action.',
      WATER_SAVING: 'Image doesn\'t clearly show water conservation. Please demonstrate the water-saving technique or device.',
      RECYCLING: 'Image doesn\'t clearly show recycling activity. Please show the recycling process or materials.',
      COMPOSTING: 'Image doesn\'t clearly show composting activity. Please demonstrate the composting setup or process.',
      CLEANUP_DRIVE: 'Image doesn\'t clearly show cleanup activity. Please show the cleanup process or before/after comparison.'
    };

    return feedbacks[category] || 'Image doesn\'t clearly show the environmental activity. Please provide a clearer image.';
  }
}

// Export singleton instance
module.exports = new SubmissionVerifier();