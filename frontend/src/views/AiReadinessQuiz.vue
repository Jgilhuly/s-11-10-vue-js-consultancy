<template>
  <div class="quiz-container">
    <section class="py-20 bg-gray-50">
      <div class="container">
        <!-- Quiz Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">AI Readiness Quiz</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Assess your business's readiness to adopt AI technologies and identify areas for improvement.
          </p>
        </div>

        <!-- Quiz Form -->
        <div v-if="!showResults" class="card-white">
          <div class="quiz-progress mb-8">
            <div class="quiz-progress-bar">
              <div 
                class="quiz-progress-fill" 
                :style="{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </p>
          </div>

          <div class="quiz-question">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              {{ currentQuestion.question }}
            </h2>
            
            <div class="quiz-options">
              <label 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="quiz-option"
                :class="{ 'quiz-option-selected': answers[currentQuestionIndex] === index }"
              >
                <input 
                  type="radio" 
                  :name="`question-${currentQuestionIndex}`"
                  :value="index"
                  v-model="answers[currentQuestionIndex]"
                  @change="handleAnswerChange"
                />
                <span class="quiz-option-text">{{ option.text }}</span>
                <span class="quiz-option-score">{{ option.score }} points</span>
              </label>
            </div>
          </div>

          <div class="quiz-navigation">
            <button 
              class="btn btn-secondary" 
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
            >
              Previous
            </button>
            <button 
              class="btn btn-primary" 
              @click="nextQuestion"
              :disabled="answers[currentQuestionIndex] === null"
            >
              {{ currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next' }}
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div v-else class="card-white">
          <div class="quiz-results">
            <div class="text-center mb-8">
              <div class="quiz-score-circle">
                <div class="quiz-score-number">{{ totalScore }}</div>
                <div class="quiz-score-total">/ {{ maxScore }}</div>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mt-6 mb-4">
                {{ getScoreTitle() }}
              </h2>
              <p class="text-xl text-gray-600">
                {{ getScoreDescription() }}
              </p>
            </div>

            <!-- Score Breakdown -->
            <div class="quiz-breakdown mb-8">
              <h3 class="text-2xl font-semibold text-gray-900 mb-6">Score Breakdown</h3>
              <div class="grid grid-3">
                <div 
                  v-for="category in scoreBreakdown" 
                  :key="category.name"
                  class="card"
                >
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h4>
                  <div class="quiz-category-score">
                    <span class="text-2xl font-bold text-primary">{{ category.score }}</span>
                    <span class="text-gray-600">/ {{ category.max }}</span>
                  </div>
                  <div class="quiz-category-bar">
                    <div 
                      class="quiz-category-bar-fill" 
                      :style="{ width: `${(category.score / category.max) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div class="quiz-recommendations">
              <h3 class="text-2xl font-semibold text-gray-900 mb-6">Recommendations</h3>
              <ul class="quiz-recommendations-list">
                <li 
                  v-for="(recommendation, index) in recommendations" 
                  :key="index"
                  class="quiz-recommendation-item"
                >
                  <span class="quiz-recommendation-icon">💡</span>
                  <span>{{ recommendation }}</span>
                </li>
              </ul>
            </div>

            <!-- Actions -->
            <div class="quiz-actions mt-8">
              <button class="btn btn-primary" @click="openContactModal">
                Get Expert Consultation
              </button>
              <button class="btn btn-secondary" @click="restartQuiz">
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'

export default {
  name: 'AiReadinessQuiz',
  setup() {
    const contactModalFunctions = inject('showContactModal')
    
    const currentQuestionIndex = ref(0)
    const answers = ref([])
    const showResults = ref(false)

    const questions = ref([
      {
        category: 'Data Readiness',
        question: 'How would you describe your organization\'s data quality and accessibility?',
        options: [
          { text: 'We have clean, well-organized data that is easily accessible', score: 5 },
          { text: 'We have good data but it\'s scattered across different systems', score: 4 },
          { text: 'We have data but it needs significant cleaning and organization', score: 3 },
          { text: 'We have limited data and it\'s difficult to access', score: 2 },
          { text: 'We have very little structured data available', score: 1 }
        ]
      },
      {
        category: 'Data Readiness',
        question: 'What is the volume and variety of your data?',
        options: [
          { text: 'Large volumes of diverse, high-quality data', score: 5 },
          { text: 'Moderate volumes with good variety', score: 4 },
          { text: 'Moderate volumes but limited variety', score: 3 },
          { text: 'Small volumes with limited variety', score: 2 },
          { text: 'Very limited data available', score: 1 }
        ]
      },
      {
        category: 'Technical Infrastructure',
        question: 'How would you rate your current IT infrastructure?',
        options: [
          { text: 'Cloud-based, scalable, and modern infrastructure', score: 5 },
          { text: 'Mostly cloud-based with some legacy systems', score: 4 },
          { text: 'Mix of cloud and on-premise systems', score: 3 },
          { text: 'Primarily on-premise with limited cloud adoption', score: 2 },
          { text: 'Outdated infrastructure with minimal cloud presence', score: 1 }
        ]
      },
      {
        category: 'Technical Infrastructure',
        question: 'Do you have APIs and integration capabilities?',
        options: [
          { text: 'Well-established APIs and integration platform', score: 5 },
          { text: 'Some APIs and basic integration capabilities', score: 4 },
          { text: 'Limited APIs, manual integration processes', score: 3 },
          { text: 'Very few APIs, mostly manual processes', score: 2 },
          { text: 'No APIs, completely manual processes', score: 1 }
        ]
      },
      {
        category: 'Team Capabilities',
        question: 'What is your team\'s level of AI/ML expertise?',
        options: [
          { text: 'We have dedicated AI/ML experts and data scientists', score: 5 },
          { text: 'We have some team members with AI/ML experience', score: 4 },
          { text: 'We have technical team members willing to learn', score: 3 },
          { text: 'Limited technical expertise, would need training', score: 2 },
          { text: 'No technical expertise in AI/ML', score: 1 }
        ]
      },
      {
        category: 'Team Capabilities',
        question: 'How open is your organization to change and innovation?',
        options: [
          { text: 'Highly innovative culture, embraces new technologies', score: 5 },
          { text: 'Generally open to innovation and change', score: 4 },
          { text: 'Moderately open, some resistance to change', score: 3 },
          { text: 'Conservative culture, slow to adopt new technologies', score: 2 },
          { text: 'Very resistant to change and new technologies', score: 1 }
        ]
      },
      {
        category: 'Strategic Alignment',
        question: 'Do you have clear AI use cases identified?',
        options: [
          { text: 'Multiple well-defined use cases with clear ROI', score: 5 },
          { text: 'Several potential use cases identified', score: 4 },
          { text: 'A few use cases under consideration', score: 3 },
          { text: 'Vague ideas about potential use cases', score: 2 },
          { text: 'No clear use cases identified', score: 1 }
        ]
      },
      {
        category: 'Strategic Alignment',
        question: 'How aligned is AI adoption with your business strategy?',
        options: [
          { text: 'AI is a core part of our strategic plan', score: 5 },
          { text: 'AI aligns well with our business objectives', score: 4 },
          { text: 'AI is somewhat aligned with our strategy', score: 3 },
          { text: 'AI strategy is not clearly defined', score: 2 },
          { text: 'No AI strategy in place', score: 1 }
        ]
      },
      {
        category: 'Budget & Resources',
        question: 'What is your budget allocation for AI initiatives?',
        options: [
          { text: 'Dedicated budget with multi-year commitment', score: 5 },
          { text: 'Allocated budget for AI projects', score: 4 },
          { text: 'Flexible budget that can be allocated', score: 3 },
          { text: 'Limited budget, would need to justify ROI', score: 2 },
          { text: 'No budget allocated for AI initiatives', score: 1 }
        ]
      },
      {
        category: 'Budget & Resources',
        question: 'What is your timeline for AI implementation?',
        options: [
          { text: 'Ready to start immediately', score: 5 },
          { text: 'Within the next 3-6 months', score: 4 },
          { text: 'Within the next 6-12 months', score: 3 },
          { text: 'Considering for next year', score: 2 },
          { text: 'No timeline, just exploring', score: 1 }
        ]
      }
    ])

    // Initialize answers array
    answers.value = new Array(questions.value.length).fill(null)

    const currentQuestion = computed(() => {
      return questions.value[currentQuestionIndex.value]
    })

    const maxScore = computed(() => {
      return questions.value.length * 5
    })

    const totalScore = computed(() => {
      return answers.value.reduce((sum, answerIndex, qIndex) => {
        if (answerIndex !== null) {
          return sum + questions.value[qIndex].options[answerIndex].score
        }
        return sum
      }, 0)
    })

    const scoreBreakdown = computed(() => {
      const categories = {}
      
      questions.value.forEach((question, index) => {
        if (!categories[question.category]) {
          categories[question.category] = {
            name: question.category,
            score: 0,
            max: 0
          }
        }
        
        if (answers.value[index] !== null) {
          categories[question.category].score += question.options[answers.value[index]].score
        }
        categories[question.category].max += 5
      })
      
      return Object.values(categories)
    })

    const recommendations = computed(() => {
      const recs = []
      const percentage = (totalScore.value / maxScore.value) * 100

      if (percentage < 40) {
        recs.push('Start with foundational data infrastructure improvements')
        recs.push('Develop a clear AI strategy aligned with business goals')
        recs.push('Invest in team training and consider hiring AI expertise')
        recs.push('Begin with small pilot projects to build confidence')
        recs.push('Establish data governance and quality processes')
      } else if (percentage < 60) {
        recs.push('Focus on improving data quality and accessibility')
        recs.push('Identify and prioritize high-impact AI use cases')
        recs.push('Strengthen technical infrastructure for AI workloads')
        recs.push('Build internal AI capabilities through training')
        recs.push('Create a roadmap for gradual AI adoption')
      } else if (percentage < 80) {
        recs.push('Scale successful pilot projects across the organization')
        recs.push('Invest in advanced AI capabilities and tools')
        recs.push('Foster a culture of continuous AI innovation')
        recs.push('Consider strategic partnerships for specialized AI needs')
        recs.push('Measure and optimize AI ROI continuously')
      } else {
        recs.push('You\'re well-positioned for advanced AI implementations')
        recs.push('Focus on scaling AI across multiple business functions')
        recs.push('Explore cutting-edge AI technologies and innovations')
        recs.push('Share AI best practices and learnings internally')
        recs.push('Consider becoming an AI leader in your industry')
      }

      // Add category-specific recommendations
      scoreBreakdown.value.forEach(category => {
        const categoryPercentage = (category.score / category.max) * 100
        if (categoryPercentage < 50) {
          if (category.name === 'Data Readiness') {
            recs.push(`Improve ${category.name.toLowerCase()} by investing in data quality tools and processes`)
          } else if (category.name === 'Technical Infrastructure') {
            recs.push(`Enhance ${category.name.toLowerCase()} to support AI workloads`)
          } else if (category.name === 'Team Capabilities') {
            recs.push(`Develop ${category.name.toLowerCase()} through training and hiring`)
          } else if (category.name === 'Strategic Alignment') {
            recs.push(`Strengthen ${category.name.toLowerCase()} with clear AI strategy`)
          } else if (category.name === 'Budget & Resources') {
            recs.push(`Secure ${category.name.toLowerCase()} for AI initiatives`)
          }
        }
      })

      return recs
    })

    const handleAnswerChange = () => {
      // Answer changed, enable next button
    }

    const nextQuestion = () => {
      if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++
      } else {
        showResults.value = true
      }
    }

    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
      }
    }

    const restartQuiz = () => {
      currentQuestionIndex.value = 0
      answers.value = new Array(questions.value.length).fill(null)
      showResults.value = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getScoreTitle = () => {
      const percentage = (totalScore.value / maxScore.value) * 100
      if (percentage >= 80) return 'Excellent - AI Ready!'
      if (percentage >= 60) return 'Good - Well Positioned'
      if (percentage >= 40) return 'Moderate - Building Foundation'
      return 'Early Stage - Needs Development'
    }

    const getScoreDescription = () => {
      const percentage = (totalScore.value / maxScore.value) * 100
      if (percentage >= 80) {
        return 'Your organization is well-prepared for AI adoption. Focus on scaling and advanced implementations.'
      }
      if (percentage >= 60) {
        return 'You have a solid foundation. Continue building capabilities and identifying opportunities.'
      }
      if (percentage >= 40) {
        return 'You\'re on the right track. Focus on strengthening key areas before major AI initiatives.'
      }
      return 'There\'s significant opportunity for improvement. Start with foundational elements.'
    }

    const openContactModal = () => {
      if (contactModalFunctions) {
        contactModalFunctions.open()
      }
    }

    return {
      currentQuestionIndex,
      answers,
      showResults,
      questions,
      currentQuestion,
      maxScore,
      totalScore,
      scoreBreakdown,
      recommendations,
      handleAnswerChange,
      nextQuestion,
      previousQuestion,
      restartQuiz,
      getScoreTitle,
      getScoreDescription,
      openContactModal
    }
  }
}
</script>

<style scoped>
.quiz-container {
  min-height: calc(100vh - 200px);
}

.quiz-progress {
  margin-bottom: 2rem;
}

.quiz-progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s ease;
}

.quiz-question {
  margin-bottom: 2rem;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-primary);
}

.quiz-option:hover {
  border-color: #3b82f6;
  background-color: var(--bg-secondary);
}

.quiz-option-selected {
  border-color: #3b82f6;
  background-color: var(--bg-tertiary);
}

.quiz-option input[type="radio"] {
  margin-right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.quiz-option-text {
  flex: 1;
  font-size: 1rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.quiz-option-score {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-left: 1rem;
}

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.quiz-navigation .btn {
  min-width: 120px;
}

.quiz-navigation .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quiz-results {
  padding: 1rem;
}

.quiz-score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  margin: 0 auto;
}

.quiz-score-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.quiz-score-total {
  font-size: 1.25rem;
  opacity: 0.9;
}

.quiz-breakdown {
  margin-bottom: 2rem;
}

.quiz-category-score {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quiz-category-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.quiz-category-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s ease;
}

.quiz-recommendations-list {
  list-style: none;
  padding: 0;
}

.quiz-recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
  transition: background-color 0.3s ease;
}

.quiz-recommendation-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.quiz-recommendation-item span:last-child {
  color: var(--text-primary);
  line-height: 1.6;
}

.quiz-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.quiz-actions .btn {
  min-width: 200px;
}

@media (max-width: 768px) {
  .quiz-navigation {
    flex-direction: column;
  }
  
  .quiz-navigation .btn {
    width: 100%;
  }
  
  .quiz-actions {
    flex-direction: column;
  }
  
  .quiz-actions .btn {
    width: 100%;
  }
  
  .quiz-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .quiz-option-score {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>

