/**
 * PlantNet API client for plant identification
 * This is a placeholder for future plant identification integration
 */

class PlantIdClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://my-api.plantnet.org/v2/identify';
  }

  /**
   * Identify plant species from image
   */
  async identifyPlant(imageUrl, plantParts = ['leaf']) {
    try {
      // In production, this would make actual API calls to PlantNet
      // For now, return mock data
      
      const mockIdentification = {
        results: this.generateMockPlantResults(),
        metadata: {
          images: [imageUrl],
          plant_net_id: 'mock_plant_id',
          plant_details: {
            common_names: ['Mock Tree', 'Environmental Plant'],
            scientific_name: 'Mockus Environmentalis',
            family: 'Mockaceae',
            genus: 'Mockus'
          }
        }
      };

      return {
        success: true,
        data: mockIdentification
      };

    } catch (error) {
      console.error('PlantNet API error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify if plant is suitable for environmental challenge
   */
  async verifyPlantForChallenge(imageUrl, challengeCategory) {
    try {
      const identification = await this.identifyPlant(imageUrl);
      
      if (!identification.success) {
        return {
          verified: false,
          confidence: 0,
          feedback: 'Unable to identify plant species'
        };
      }

      const { results } = identification.data;
      const topResult = results[0];
      
      // Check if plant is suitable for the challenge category
      const isSuitable = this.isPlantSuitableForChallenge(topResult, challengeCategory);
      const confidence = topResult.score;

      return {
        verified: isSuitable,
        confidence,
        feedback: this.generatePlantFeedback(isSuitable, confidence, topResult),
        plantInfo: topResult
      };

    } catch (error) {
      console.error('Plant verification error:', error);
      return {
        verified: false,
        confidence: 0,
        feedback: 'Error verifying plant for environmental challenge'
      };
    }
  }

  /**
   * Generate mock plant identification results
   */
  generateMockPlantResults() {
    const possiblePlants = [
      {
        species: {
          scientificNameWithoutAuthor: 'Ficus religiosa',
          scientificNameAuthorship: 'L.',
          genus: { scientificNameWithoutAuthor: 'Ficus' },
          family: { scientificNameWithoutAuthor: 'Moraceae' }
        },
        score: 0.95,
        commonNames: ['Sacred Fig', 'Peepal Tree', 'Bodhi Tree']
      },
      {
        species: {
          scientificNameWithoutAuthor: 'Azadirachta indica',
          scientificNameAuthorship: 'A.Juss.',
          genus: { scientificNameWithoutAuthor: 'Azadirachta' },
          family: { scientificNameWithoutAuthor: 'Meliaceae' }
        },
        score: 0.87,
        commonNames: ['Neem Tree', 'Indian Lilac']
      },
      {
        species: {
          scientificNameWithoutAuthor: 'Mangifera indica',
          scientificNameAuthorship: 'L.',
          genus: { scientificNameWithoutAuthor: 'Mangifera' },
          family: { scientificNameWithoutAuthor: 'Anacardiaceae' }
        },
        score: 0.82,
        commonNames: ['Mango Tree']
      },
      {
        species: {
          scientificNameWithoutAuthor: 'Tectona grandis',
          scientificNameAuthorship: 'L.f.',
          genus: { scientificNameWithoutAuthor: 'Tectona' },
          family: { scientificNameWithoutAuthor: 'Lamiaceae' }
        },
        score: 0.78,
        commonNames: ['Teak Tree']
      }
    ];

    // Return 2-4 random results
    const numResults = Math.floor(Math.random() * 3) + 2;
    return possiblePlants
      .sort(() => Math.random() - 0.5)
      .slice(0, numResults);
  }

  /**
   * Check if plant is suitable for specific challenge category
   */
  isPlantSuitableForChallenge(plantResult, challengeCategory) {
    const plantName = plantResult.species.scientificNameWithoutAuthor.toLowerCase();
    const commonNames = plantResult.commonNames.join(' ').toLowerCase();
    
    // Define suitable plants for each challenge category
    const suitablePlants = {
      TREE_PLANTING: [
        'ficus', 'azadirachta', 'mangifera', 'tectona', 'eucalyptus', 'acacia',
        'banyan', 'peepal', 'neem', 'mango', 'teak', 'oak', 'pine', 'cedar'
      ],
      BIODIVERSITY: [
        'native', 'indigenous', 'endemic', 'local', 'wild', 'natural'
      ],
      CLIMATE_CHANGE: [
        'carbon', 'oxygen', 'sequestration', 'air', 'purification'
      ]
    };

    const keywords = suitablePlants[challengeCategory] || suitablePlants.TREE_PLANTING;
    
    return keywords.some(keyword => 
      plantName.includes(keyword) || commonNames.includes(keyword)
    );
  }

  /**
   * Generate feedback based on plant identification
   */
  generatePlantFeedback(isSuitable, confidence, plantInfo) {
    const plantName = plantInfo.species.scientificNameWithoutAuthor;
    const commonName = plantInfo.commonNames[0] || 'Unknown';
    
    if (isSuitable && confidence > 0.7) {
      return `Great choice! Identified as ${commonName} (${plantName}). This is an excellent plant for environmental conservation.`;
    } else if (isSuitable && confidence > 0.5) {
      return `Good choice! Likely ${commonName} (${plantName}). This plant contributes to environmental health.`;
    } else if (confidence > 0.7) {
      return `Identified as ${commonName} (${plantName}), but this plant may not be ideal for this environmental challenge. Consider native or more suitable species.`;
    } else {
      return `Plant identification uncertain. Please ensure you're planting appropriate species for environmental conservation.`;
    }
  }

  /**
   * Get plant care tips based on identification
   */
  async getPlantCareTips(plantInfo) {
    const plantName = plantInfo.species.scientificNameWithoutAuthor;
    
    // Mock care tips based on plant type
    const careTips = {
      'Ficus religiosa': [
        'Water regularly but avoid overwatering',
        'Provide bright, indirect sunlight',
        'Prune dead branches regularly',
        'Use well-draining soil'
      ],
      'Azadirachta indica': [
        'Drought tolerant once established',
        'Full sun preferred',
        'Minimal watering required',
        'Natural pest repellent properties'
      ],
      'Mangifera indica': [
        'Regular watering during growing season',
        'Full sun required',
        'Fertilize during growing season',
        'Protect from frost'
      ],
      'Tectona grandis': [
        'Well-draining soil essential',
        'Regular watering when young',
        'Full sun preferred',
        'Space for large growth'
      ]
    };

    return careTips[plantName] || [
      'Water regularly but avoid overwatering',
      'Provide adequate sunlight',
      'Use appropriate soil type',
      'Monitor for pests and diseases'
    ];
  }
}

module.exports = PlantIdClient;