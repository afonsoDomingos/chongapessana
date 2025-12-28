<template>
  <div class="courses-page">
    <h1 class="cinematic-font text-center shimmer-text">{{ $t('courses.title') }}</h1>
    
    <!-- Payment Methods - With Official Logos -->
    <section class="payment-hero-section">
      <div class="payment-hero-card">
        <div class="payment-badge">💳 FORMAS DE PAGAMENTO</div>
        <h3 class="payment-title">Escolhe o curso e paga para uma destas contas:</h3>
        
        <div class="payment-logos-grid">
          <div class="payment-logo-card">
            <img src="/images/emola-logo.png" alt="E-Mola" class="payment-logo" />
            <div class="payment-details">
              <span class="pay-num">868 497 771</span>
              <span class="pay-owner">Castigo Alexandre Pessana</span>
            </div>
          </div>

          <div class="payment-logo-card">
            <img src="/images/mpesa-logo.png" alt="M-Pesa" class="payment-logo" />
            <div class="payment-details">
              <span class="pay-num">847 877 405</span>
              <span class="pay-owner">Afonso Domingos</span>
            </div>
          </div>

          <div class="payment-logo-card">
            <img src="/images/visa-logo.png" alt="Visa/BIM" class="payment-logo" />
            <div class="payment-details">
              <span class="pay-num-small">NIB: 0001 0000 0074 3010 49557</span>
              <span class="pay-owner">Millennium BIM</span>
            </div>
          </div>

          <div class="payment-logo-card">
            <img src="/images/paypal-logo.png" alt="PayPal" class="payment-logo" />
            <div class="payment-details">
              <span class="pay-num-small">karinganastudio23@gmail.com</span>
            </div>
          </div>
        </div>

        <div class="payment-note">
          <i class="fas fa-info-circle"></i>
          Após inscrição, vai ao teu painel e envia o comprovativo de pagamento
        </div>
      </div>
    </section>

    <div class="courses-grid" v-if="courses.length">
      <div v-for="(course, index) in courses" :key="course._id" class="course-card animate-up" :style="{ animationDelay: (index * 0.1) + 's' }">
        <div class="course-img" :style="{ backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?auto=format&fit=crop&q=80&w=800'})` }"></div>
        <div class="course-info">
          <h3>{{ course.title[$i18n.locale] }}</h3>
          <p>{{ course.description[$i18n.locale] }}</p>
          <div class="course-meta">
            <span class="price">{{ course.price }} {{ course.currency }}</span>
            <span class="date" v-if="course.startDate">{{ course.startDate }}</span>
          </div>
          <button @click="enroll(course._id)" class="btn-enroll" :disabled="loading">
            <i class="fas fa-graduation-cap"></i>
            {{ loading ? '...' : $t('courses.enroll') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center p-5 no-courses">
        <i class="fas fa-film"></i>
        <p>Cursos em breve...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { notify } from '../utils/swal'

const courses = ref([])
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const fetchCourses = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/courses')
    courses.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const enroll = async (courseId) => {
  if (!auth.isAuthenticated) {
    notify.error('Sessão Necessária', 'Precisas de entrar na tua conta primeiro.')
    router.push('/login')
    return
  }
  
  loading.value = true
  try {
    await axios.post('http://localhost:5000/api/courses/enroll', { courseId }, {
        headers: { Authorization: `Bearer ${auth.token}` }
    })
    notify.success('Inscrição Feita!', 'Vai ao teu painel e envia o comprovativo de pagamento.')
    router.push('/dashboard')
  } catch (err) {
    notify.error('Erro', err.response?.data?.message || 'Erro ao inscrever')
  } finally {
    loading.value = false
  }
}

onMounted(fetchCourses)
</script>

<style scoped>
.courses-page {
    padding: 3rem 2rem;
    min-height: 80vh;
}

.shimmer-text {
  background: linear-gradient(90deg, var(--text-primary), var(--accent), var(--text-primary));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Payment Hero - Modern Clean Design */
.payment-hero-section {
  max-width: 1100px;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
}

.payment-hero-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08));
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}

.payment-badge {
  display: inline-block;
  padding: 0.6rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.payment-title {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.payment-note {
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a8b4e8;
  font-weight: 500;
}

.payment-note i {
  margin-right: 0.5rem;
  color: #667eea;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

.pay-card {
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.pay-card:hover {
  transform: translateY(-8px) scale(1.03);
}

.emola-card {
  background: linear-gradient(135deg, #e60000, #ff4444);
  box-shadow: 0 10px 30px rgba(230, 0, 0, 0.4);
}

.mpesa-card {
  background: linear-gradient(135deg, #00a651, #00d46a);
  box-shadow: 0 10px 30px rgba(0, 166, 81, 0.4);
}

.bim-card {
  background: linear-gradient(135deg, #003366, #0066cc);
  box-shadow: 0 10px 30px rgba(0, 51, 102, 0.4);
}

.paypal-card {
  background: linear-gradient(135deg, #003087, #009cde);
  box-shadow: 0 10px 30px rgba(0, 48, 135, 0.4);
}

.pay-icon {
  font-size: 2.2rem;
  color: white;
  margin-bottom: 0.5rem;
}

.pay-label {
  font-size: 1rem;
  font-weight: 800;
  color: rgba(255,255,255,0.95);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.pay-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.3rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.pay-name {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
}

.payment-note {
  margin-top: 2rem;
  padding: 1.2rem;
  background: rgba(241, 196, 15, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(241, 196, 15, 0.4);
  color: #f1c40f;
  font-weight: 600;
  font-size: 1rem;
}

.payment-note i {
  margin-right: 0.5rem;
}

/* Courses Grid */
.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.course-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.course-card:hover { 
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(231,76,60,0.1);
  border-color: var(--accent);
}

.course-img { 
  height: 220px; 
  background-size: cover; 
  background-position: center;
  position: relative;
}

.course-img::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
}

.course-info { 
  padding: 1.5rem; 
}

.course-info h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.course-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.course-meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin: 1rem 0; 
  font-weight: bold; 
}

.course-meta .price {
  font-size: 1.3rem;
  color: var(--accent);
}

.course-meta .date {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.btn-enroll { 
  width: 100%; 
  padding: 1rem; 
  background: linear-gradient(135deg, var(--accent), #e74c3c);
  border: none; 
  border-radius: 12px;
  font-weight: bold; 
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-enroll:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(231,76,60,0.4);
}

.btn-enroll:disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
}

.btn-enroll i {
  margin-right: 0.5rem;
}

.no-courses {
  padding: 5rem 2rem;
}

.no-courses i {
  font-size: 4rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.no-courses p {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.text-center { text-align: center; }

@media (max-width: 900px) {
  .payment-logos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .payment-logos-grid {
    grid-template-columns: 1fr;
  }
  .pay-num {
    font-size: 1.1rem;
  }
}

/* Official Payment Logos */
.payment-logos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.payment-logo-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.payment-logo-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.payment-logo {
  width: 100px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.pay-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-num-small {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-owner {
  font-size: 0.8rem;
  color: #666;
}
</style>

