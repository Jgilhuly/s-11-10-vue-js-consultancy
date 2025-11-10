<template>
  <div class="dashboard">
    <!-- User Information Card -->
    <section class="py-20 bg-gray-50">
      <div class="container">
        <div class="card-white mb-8">
          <div class="dashboard-user-info">
            <div class="dashboard-avatar">
              <span>{{ dashboardData.user?.avatar || 'AU' }}</span>
            </div>
            <div class="dashboard-user-details">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ dashboardData.user?.name || 'Loading...' }}
              </h2>
              <p class="text-gray-600 mb-1">{{ dashboardData.user?.email || '' }}</p>
              <span class="dashboard-badge">{{ dashboardData.user?.role || '' }}</span>
            </div>
          </div>
        </div>

        <!-- Key Metrics Cards -->
        <div class="grid grid-3 mb-8">
          <div class="card-white">
            <div class="dashboard-metric-icon">🎯</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Total Services</h3>
            <p class="text-3xl font-bold text-primary">
              {{ dashboardData.metrics?.totalServices || 0 }}
            </p>
          </div>
          
          <div class="card-white">
            <div class="dashboard-metric-icon">👥</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Team Members</h3>
            <p class="text-3xl font-bold text-primary">
              {{ dashboardData.metrics?.activeTeamMembers || 0 }}
            </p>
          </div>
          
          <div class="card-white">
            <div class="dashboard-metric-icon">📧</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Total Consultations</h3>
            <p class="text-3xl font-bold text-primary">
              {{ dashboardData.metrics?.totalConsultations || 0 }}
            </p>
          </div>
          
          <div class="card-white">
            <div class="dashboard-metric-icon">⏳</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pending</h3>
            <p class="text-3xl font-bold text-primary">
              {{ dashboardData.metrics?.pendingConsultations || 0 }}
            </p>
          </div>
          
          <div class="card-white">
            <div class="dashboard-metric-icon">✅</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Response Rate</h3>
            <p class="text-3xl font-bold text-primary">
              {{ dashboardData.metrics?.responseRate || 0 }}%
            </p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card-white mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div v-if="dashboardData.recentActivity && dashboardData.recentActivity.length > 0">
            <div 
              v-for="activity in dashboardData.recentActivity" 
              :key="activity.id"
              class="dashboard-activity-item"
            >
              <div class="dashboard-activity-icon">📋</div>
              <div class="dashboard-activity-content">
                <h4 class="text-lg font-semibold text-gray-900">{{ activity.title }}</h4>
                <p class="text-sm text-gray-600">{{ formatDate(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-8">
            <p>No recent activity</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card-white">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div class="dashboard-quick-actions">
            <router-link to="/services/manage" class="btn btn-primary">
              Manage Services
            </router-link>
            <router-link to="/#contact" class="btn btn-secondary" @click="navigateToContact">
              Contact Form
            </router-link>
            <router-link to="/" class="btn btn-secondary" @click="navigateToServices">
              View Services
            </router-link>
            <router-link to="/" class="btn btn-secondary" @click="navigateToTeam">
              View Team
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const dashboardData = ref({
      user: null,
      metrics: null,
      recentActivity: []
    })
    const isLoading = ref(true)
    const error = ref(null)

    const fetchDashboardData = async () => {
      try {
        isLoading.value = true
        const response = await axios.get('/api/dashboard')
        dashboardData.value = response.data
        error.value = null
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        error.value = 'Failed to load dashboard data'
        // Set default values on error
        dashboardData.value = {
          user: {
            id: 1,
            name: "Admin User",
            email: "admin@neuralink-ai.com",
            role: "Admin",
            avatar: "AU"
          },
          metrics: {
            totalServices: 0,
            activeTeamMembers: 0,
            totalConsultations: 0,
            pendingConsultations: 0,
            responseRate: 0
          },
          recentActivity: []
        }
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const navigateToContact = (e) => {
      e.preventDefault()
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.getElementById('contact')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      })
    }

    const navigateToServices = (e) => {
      e.preventDefault()
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.getElementById('services')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      })
    }

    const navigateToTeam = (e) => {
      e.preventDefault()
      router.push('/').then(() => {
        setTimeout(() => {
          const element = document.getElementById('team')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      })
    }

    onMounted(fetchDashboardData)

    return {
      dashboardData,
      isLoading,
      error,
      formatDate,
      navigateToContact,
      navigateToServices,
      navigateToTeam
    }
  }
}
</script>

<style scoped>
.dashboard-user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.dashboard-avatar {
  width: 5rem;
  height: 5rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  flex-shrink: 0;
}

.dashboard-user-details {
  flex: 1;
}

.dashboard-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #3b82f6;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.dashboard-metric-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.dashboard-activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-activity-item:last-child {
  border-bottom: none;
}

.dashboard-activity-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.dashboard-activity-content {
  flex: 1;
}

.dashboard-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-quick-actions .btn {
  flex: 1;
  min-width: 150px;
}

@media (max-width: 768px) {
  .dashboard-user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .dashboard-quick-actions {
    flex-direction: column;
  }
  
  .dashboard-quick-actions .btn {
    width: 100%;
  }
}
</style>

