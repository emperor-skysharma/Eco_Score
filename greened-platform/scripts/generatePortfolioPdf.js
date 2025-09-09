const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Portfolio PDF Generator
 * Generates a professional PDF portfolio from user's environmental activities
 */

class PortfolioGenerator {
  constructor() {
    this.templatePath = path.join(__dirname, '../templates/portfolio.html');
  }

  /**
   * Generate PDF portfolio for a user
   */
  async generatePortfolio(userData, activities, badges, outputPath) {
    try {
      const html = await this.generateHTML(userData, activities, badges);
      const pdf = await this.htmlToPdf(html);
      
      await fs.writeFile(outputPath, pdf);
      
      return {
        success: true,
        path: outputPath,
        size: pdf.length
      };
    } catch (error) {
      console.error('Portfolio generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate HTML content for portfolio
   */
  async generateHTML(userData, activities, badges) {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const totalPoints = activities.reduce((sum, activity) => sum + (activity.points || 0), 0);
    const completedChallenges = activities.filter(a => a.type === 'challenge').length;
    const completedModules = activities.filter(a => a.type === 'module').length;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userData.firstName} ${userData.lastName} - Environmental Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2e7d32, #4caf50);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .header .date {
            margin-top: 20px;
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            color: #2e7d32;
            font-size: 1.8em;
            margin-bottom: 20px;
            border-bottom: 2px solid #4caf50;
            padding-bottom: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #4caf50;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #2e7d32;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        
        .badges-section {
            margin-bottom: 30px;
        }
        
        .badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .badge {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #c8e6c9;
        }
        
        .badge-icon {
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .badge-name {
            font-weight: bold;
            color: #2e7d32;
            margin-bottom: 5px;
        }
        
        .badge-desc {
            font-size: 0.8em;
            color: #666;
        }
        
        .activities-list {
            list-style: none;
        }
        
        .activity-item {
            background: #f8f9fa;
            margin-bottom: 15px;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4caf50;
        }
        
        .activity-title {
            font-weight: bold;
            color: #2e7d32;
            margin-bottom: 5px;
        }
        
        .activity-meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }
        
        .activity-desc {
            color: #555;
        }
        
        .footer {
            background: #2e7d32;
            color: white;
            padding: 20px 30px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .footer .platform {
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${userData.firstName} ${userData.lastName}</h1>
            <div class="subtitle">Environmental Portfolio</div>
            <div class="date">Generated on ${currentDate}</div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Profile Information</h2>
                <p><strong>School:</strong> ${userData.school || 'Not specified'}</p>
                <p><strong>Grade:</strong> ${userData.grade || 'Not specified'}</p>
                <p><strong>Level:</strong> ${userData.level}</p>
                <p><strong>Total Points:</strong> ${userData.points}</p>
            </div>
            
            <div class="section">
                <h2>Environmental Impact Summary</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${totalPoints}</div>
                        <div class="stat-label">Total Points Earned</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${completedChallenges}</div>
                        <div class="stat-label">Challenges Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${completedModules}</div>
                        <div class="stat-label">Learning Modules</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${badges.length}</div>
                        <div class="stat-label">Badges Earned</div>
                    </div>
                </div>
            </div>
            
            ${badges.length > 0 ? `
            <div class="section badges-section">
                <h2>Achievements & Badges</h2>
                <div class="badges-grid">
                    ${badges.map(badge => `
                        <div class="badge">
                            <div class="badge-icon">${badge.badge.icon}</div>
                            <div class="badge-name">${badge.badge.name}</div>
                            <div class="badge-desc">${badge.badge.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="section">
                <h2>Environmental Activities</h2>
                <ul class="activities-list">
                    ${activities.map(activity => `
                        <li class="activity-item">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-meta">
                                ${activity.type === 'challenge' ? 'Challenge' : 'Learning Module'} • 
                                ${activity.category} • 
                                ${activity.points || 0} points • 
                                ${new Date(activity.createdAt).toLocaleDateString()}
                            </div>
                            <div class="activity-desc">${activity.description}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This portfolio demonstrates ${userData.firstName}'s commitment to environmental sustainability and education.</p>
            <p class="platform">Generated by GreenEd Platform - Gamified Environmental Education</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Convert HTML to PDF using Puppeteer
   */
  async htmlToPdf(html) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate portfolio for a user by ID
   */
  async generatePortfolioForUser(userId, outputDir = './portfolios') {
    try {
      // This would typically fetch data from the database
      // For now, we'll use mock data
      const userData = {
        firstName: 'Green',
        lastName: 'Student',
        school: 'Punjab Public School',
        grade: '10th',
        level: 5,
        points: 450
      };

      const activities = [
        {
          title: 'Plant a Tree Challenge',
          description: 'Successfully planted a neem tree in the school garden',
          type: 'challenge',
          category: 'Tree Planting',
          points: 100,
          createdAt: new Date('2024-01-15')
        },
        {
          title: 'Waste Segregation Setup',
          description: 'Implemented waste segregation system in classroom',
          type: 'challenge',
          category: 'Waste Management',
          points: 75,
          createdAt: new Date('2024-01-20')
        },
        {
          title: 'Introduction to Climate Change',
          description: 'Completed comprehensive module on climate change basics',
          type: 'module',
          category: 'Climate Change',
          points: 50,
          createdAt: new Date('2024-01-10')
        }
      ];

      const badges = [
        {
          badge: {
            name: 'First Steps',
            description: 'Complete your first environmental challenge',
            icon: '🌱'
          }
        },
        {
          badge: {
            name: 'Tree Hugger',
            description: 'Plant 5 trees',
            icon: '🌳'
          }
        }
      ];

      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      const filename = `portfolio_${userId}_${Date.now()}.pdf`;
      const outputPath = path.join(outputDir, filename);

      const result = await this.generatePortfolio(userData, activities, badges, outputPath);
      
      return result;
    } catch (error) {
      console.error('Portfolio generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// CLI usage
if (require.main === module) {
  const generator = new PortfolioGenerator();
  const userId = process.argv[2] || 'sample_user';
  
  generator.generatePortfolioForUser(userId)
    .then(result => {
      if (result.success) {
        console.log(`✅ Portfolio generated successfully: ${result.path}`);
        console.log(`📄 File size: ${(result.size / 1024).toFixed(2)} KB`);
      } else {
        console.error(`❌ Portfolio generation failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = PortfolioGenerator;