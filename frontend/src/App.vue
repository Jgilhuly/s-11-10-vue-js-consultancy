<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">NeuraLink AI</div>
          <div class="nav-right">
            <div class="nav-links">
              <router-link to="/">Home</router-link>
              <router-link to="/dashboard">Dashboard</router-link>
              <router-link to="/ai-readiness-quiz">AI Readiness Quiz</router-link>
              <a href="#services">Services</a>
              <a href="#team">Team</a>
              <a href="#contact">Contact</a>
            </div>
            <button class="dark-mode-toggle" @click="toggleDarkMode" :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
              <span v-if="isDarkMode">☀️</span>
              <span v-else>🌙</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Router View for page content -->
    <router-view></router-view>

    <!-- Footer -->
    <footer class="footer">
      <div class="container text-center">
        <div class="text-2xl font-bold mb-4">NeuraLink AI</div>
        <p class="text-gray-400">© 2024 NeuraLink AI. All rights reserved.</p>
      </div>
    </footer>

    <!-- Contact Modal (global) -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">Contact Us</h3>
          <button class="modal-close" @click="closeContactModal">&times;</button>
        </div>
        
        <form @submit.prevent="submitContactForm" class="contact-form">
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="contactForm.name" 
              required 
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              v-model="contactForm.email" 
              required 
              placeholder="Enter your email address"
            />
          </div>
          
          <div class="form-group">
            <label for="company">Company</label>
            <input 
              type="text" 
              id="company" 
              v-model="contactForm.company" 
              placeholder="Enter your company name"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="contactForm.phone" 
              placeholder="Enter your phone number"
            />
          </div>
          
          <div class="form-group">
            <label for="service">Service Interest</label>
            <select id="service" v-model="contactForm.service">
              <option value="">Select a service</option>
              <option value="ai-strategy">AI Strategy Consulting</option>
              <option value="ml-development">Machine Learning Development</option>
              <option value="automation">Process Automation</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea 
              id="message" 
              v-model="contactForm.message" 
              required 
              rows="4"
              placeholder="Tell us about your project or how we can help"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeContactModal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const showContactModal = ref(false)
    const isSubmitting = ref(false)
    const contactForm = ref({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: '',
      message: ''
    })
    
    // Dark mode state
    const isDarkMode = ref(false)
    
    // Load dark mode preference from localStorage
    const loadDarkModePreference = () => {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        isDarkMode.value = saved === 'true'
      } else {
        // Check system preference
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyDarkMode()
    }
    
    // Apply dark mode to document
    const applyDarkMode = () => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-mode')
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    }
    
    // Toggle dark mode
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value.toString())
      applyDarkMode()
    }

    const openContactModal = () => {
      showContactModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeContactModal = () => {
      showContactModal.value = false
      document.body.style.overflow = 'auto'
      // Reset form
      contactForm.value = {
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      }
    }

    const submitContactForm = async () => {
      isSubmitting.value = true
      try {
        // Send the form data to the backend
        const response = await axios.post('/api/contact/consultation', {
          name: contactForm.value.name,
          email: contactForm.value.email,
          company: contactForm.value.company,
          message: contactForm.value.message,
          serviceInterest: contactForm.value.service || 'General inquiry'
        })
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you within 24 hours.')
        
        closeContactModal()
      } catch (error) {
        console.error('Error submitting form:', error)
        if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`)
        } else {
          alert('There was an error sending your message. Please try again.')
        }
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      loadDarkModePreference()
    })

    // Provide modal functions to child components
    provide('showContactModal', {
      open: openContactModal,
      close: closeContactModal
    })

    return {
      showContactModal,
      isSubmitting,
      contactForm,
      isDarkMode,
      openContactModal,
      closeContactModal,
      submitContactForm,
      toggleDarkMode
    }
  }
}
</script>
