<template>
  <div class="services-management">
    <section class="py-20 bg-gray-50">
      <div class="container">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Manage Services</h1>
          <p class="text-xl text-gray-600">Add, edit, or remove services offered by your company</p>
        </div>

        <!-- Add New Service Button -->
        <div class="mb-6">
          <button class="btn btn-primary" @click="openAddModal">
            + Add New Service
          </button>
        </div>

        <!-- Services List -->
        <div v-if="isLoading" class="text-center py-12">
          <p class="text-gray-600">Loading services...</p>
        </div>

        <div v-else-if="error" class="card-white mb-6">
          <div class="text-red-600">{{ error }}</div>
        </div>

        <div v-else-if="services.length === 0" class="card-white text-center py-12">
          <p class="text-gray-600 mb-4">No services found. Add your first service to get started.</p>
          <button class="btn btn-primary" @click="openAddModal">
            Add Service
          </button>
        </div>

        <div v-else class="grid grid-3 mb-8">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="card-white hover-shadow"
          >
            <div class="service-card-header">
              <div class="text-4xl mb-3">{{ service.icon }}</div>
              <div class="service-actions">
                <button 
                  class="btn-icon" 
                  @click="openEditModal(service)"
                  title="Edit service"
                >
                  ✏️
                </button>
                <button 
                  class="btn-icon btn-icon-danger" 
                  @click="confirmDelete(service)"
                  title="Delete service"
                >
                  🗑️
                </button>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ service.title }}</h3>
            <p class="text-gray-600 mb-3">{{ service.description }}</p>
            <div v-if="service.features && service.features.length > 0" class="mb-3">
              <p class="text-sm font-semibold text-gray-700 mb-1">Features:</p>
              <ul class="text-sm text-gray-600 list-disc list-inside">
                <li v-for="(feature, idx) in service.features" :key="idx">{{ feature }}</li>
              </ul>
            </div>
            <p class="text-primary font-semibold">{{ service.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Add/Edit Service Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ editingService ? 'Edit Service' : 'Add New Service' }}
          </h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        
        <form @submit.prevent="saveService" class="service-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              type="text" 
              id="title" 
              v-model="serviceForm.title" 
              required 
              placeholder="e.g., AI Strategy Consulting"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description" 
              v-model="serviceForm.description" 
              required 
              rows="3"
              placeholder="Describe what this service offers"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="icon">Icon (Emoji) *</label>
            <input 
              type="text" 
              id="icon" 
              v-model="serviceForm.icon" 
              required 
              placeholder="e.g., 🎯"
              maxlength="2"
            />
            <small class="text-gray-500">Enter a single emoji character</small>
          </div>
          
          <div class="form-group">
            <label for="price">Price</label>
            <input 
              type="text" 
              id="price" 
              v-model="serviceForm.price" 
              placeholder="e.g., Starting at $15,000"
            />
          </div>
          
          <div class="form-group">
            <label for="features">Features (one per line)</label>
            <textarea 
              id="features" 
              v-model="featuresText" 
              rows="4"
              placeholder="Enter each feature on a new line"
            ></textarea>
            <small class="text-gray-500">Each line will be treated as a separate feature</small>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">Delete Service</h3>
          <button class="modal-close" @click="cancelDelete">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{{ serviceToDelete?.title }}</strong>? 
            This action cannot be undone.
          </p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="cancelDelete">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteService" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete Service' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'ServicesManagement',
  setup() {
    const services = ref([])
    const isLoading = ref(true)
    const error = ref(null)
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const isSaving = ref(false)
    const isDeleting = ref(false)
    const editingService = ref(null)
    const serviceToDelete = ref(null)
    
    const serviceForm = ref({
      title: '',
      description: '',
      icon: '',
      price: '',
      features: []
    })

    const featuresText = computed({
      get: () => serviceForm.value.features.join('\n'),
      set: (value) => {
        serviceForm.value.features = value
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0)
      }
    })

    const fetchServices = async () => {
      try {
        isLoading.value = true
        error.value = null
        const response = await axios.get('/api/services')
        services.value = response.data
      } catch (err) {
        console.error('Error fetching services:', err)
        error.value = 'Failed to load services. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    const openAddModal = () => {
      editingService.value = null
      serviceForm.value = {
        title: '',
        description: '',
        icon: '',
        price: '',
        features: []
      }
      showModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const openEditModal = (service) => {
      editingService.value = service
      serviceForm.value = {
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price || '',
        features: [...(service.features || [])]
      }
      showModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
      showModal.value = false
      editingService.value = null
      document.body.style.overflow = 'auto'
    }

    const saveService = async () => {
      isSaving.value = true
      try {
        const serviceData = {
          title: serviceForm.value.title,
          description: serviceForm.value.description,
          icon: serviceForm.value.icon,
          price: serviceForm.value.price || 'Contact for pricing',
          features: serviceForm.value.features
        }

        if (editingService.value) {
          // Update existing service
          await axios.put(`/api/services/${editingService.value.id}`, serviceData)
        } else {
          // Create new service
          await axios.post('/api/services', serviceData)
        }

        await fetchServices()
        closeModal()
      } catch (err) {
        console.error('Error saving service:', err)
        const errorMessage = err.response?.data?.message || 'Failed to save service. Please try again.'
        alert(errorMessage)
      } finally {
        isSaving.value = false
      }
    }

    const confirmDelete = (service) => {
      serviceToDelete.value = service
      showDeleteModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      serviceToDelete.value = null
      document.body.style.overflow = 'auto'
    }

    const deleteService = async () => {
      if (!serviceToDelete.value) return

      isDeleting.value = true
      try {
        await axios.delete(`/api/services/${serviceToDelete.value.id}`)
        await fetchServices()
        cancelDelete()
      } catch (err) {
        console.error('Error deleting service:', err)
        const errorMessage = err.response?.data?.message || 'Failed to delete service. Please try again.'
        alert(errorMessage)
      } finally {
        isDeleting.value = false
      }
    }

    onMounted(fetchServices)

    return {
      services,
      isLoading,
      error,
      showModal,
      showDeleteModal,
      isSaving,
      isDeleting,
      editingService,
      serviceToDelete,
      serviceForm,
      featuresText,
      openAddModal,
      openEditModal,
      closeModal,
      saveService,
      confirmDelete,
      cancelDelete,
      deleteService
    }
  }
}
</script>

<style scoped>
.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.service-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon-danger:hover {
  opacity: 1;
}

.service-form {
  padding: 1rem 0;
}

.modal-large {
  max-width: 600px;
}

.modal-body {
  padding: 1rem 0;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .service-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .service-actions {
    margin-top: 0.5rem;
  }
}
</style>

