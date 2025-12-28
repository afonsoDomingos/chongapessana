<template>
  <div class="expo-page">
    <!-- Hero Section -->
    <section class="expo-hero">
      <div class="expo-hero-bg"></div>
      <div class="expo-hero-overlay"></div>
      <div class="expo-hero-content animate-up">
        <div class="expo-badge">🎨 EXPO DIGITAL</div>
        <h1 class="cinematic-font shimmer-text">Chonga Pessana</h1>
        <p class="expo-subtitle">Viagem Visual pela Lente de um Artista Moçambicano</p>
        <div class="expo-price-tag">
          <span class="price">100 MT</span>
          <span class="label">Acesso Completo</span>
        </div>
      </div>
    </section>

    <!-- Preview Gallery -->
    <section class="expo-preview">
      <h2 class="cinematic-font text-center">Prévia da Exposição</h2>
      <p class="text-center preview-text">Uma amostra do que vais descobrir...</p>
      
      <div class="preview-grid">
        <div class="preview-item blur-preview" v-for="n in 6" :key="n">
          <img :src="`/images/${previewImages[n-1]}`" alt="Preview" />
          <div class="blur-overlay">
            <i class="fas fa-lock"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Purchase Section -->
    <section class="expo-purchase" id="purchase">
      <div class="purchase-card glass animate-up">
        <h2 class="cinematic-font">Adquirir Acesso</h2>
        
        <!-- Not logged in -->
        <div v-if="!auth.isAuthenticated" class="login-prompt">
          <div class="price-display">
            <span class="currency">MT</span>
            <span class="amount">100</span>
          </div>
          <p><i class="fas fa-user-lock"></i> Precisas de uma conta para comprar o bilhete</p>
          <router-link to="/register" class="btn-primary">
            <i class="fas fa-user-plus"></i> Criar Conta
          </router-link>
          <p class="mt-1">Já tens conta? <router-link to="/login">Entrar</router-link></p>
        </div>

        <!-- Logged in - No ticket -->
        <div v-else-if="!ticket" class="purchase-flow">
          <div class="price-display">
            <span class="currency">MT</span>
            <span class="amount">100</span>
          </div>
          <button @click="initPurchase" class="btn-primary btn-large" :disabled="loading">
            <i class="fas fa-ticket-alt"></i> Comprar Bilhete
          </button>
        </div>

        <!-- Pending Payment - WITH OFFICIAL LOGOS -->
        <div v-else-if="ticket.status === 'pending'" class="payment-flow">
          <div class="status-badge pending">
            <i class="fas fa-clock"></i> Aguardando Pagamento
          </div>
          
          <div class="payment-methods-official">
            <h3>💳 Faz o pagamento para uma destas contas:</h3>
            
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
          </div>

          <div class="upload-section" v-if="!ticket.proofUrl">
            <h3><i class="fas fa-upload"></i> Enviar Comprovativo</h3>
            <label class="upload-btn">
              <input type="file" @change="uploadProof" accept="image/*" hidden />
              <i class="fas fa-cloud-upload-alt"></i> Selecionar Comprovativo
            </label>
          </div>

          <div class="proof-submitted" v-else>
            <i class="fas fa-check-circle"></i>
            <p>Comprovativo enviado! Aguarda a validação do administrador.</p>
          </div>
        </div>

        <!-- Approved -->
        <div v-else-if="ticket.status === 'approved'" class="access-granted">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Acesso Aprovado!</h3>
          <p>Bem-vindo à Expo Digital de Chonga Pessana</p>
          <button @click="enterExpo" class="btn-primary btn-large">
            <i class="fas fa-door-open"></i> Entrar na Exposição
          </button>
        </div>

        <!-- Rejected -->
        <div v-else-if="ticket.status === 'rejected'" class="access-denied">
          <div class="error-icon">
            <i class="fas fa-times-circle"></i>
          </div>
          <h3>Pagamento Rejeitado</h3>
          <p>Por favor, envia um novo comprovativo válido.</p>
          <label class="upload-btn">
            <input type="file" @change="uploadProof" accept="image/*" hidden />
            <i class="fas fa-redo"></i> Reenviar Comprovativo
          </label>
        </div>
      </div>
    </section>

    <!-- Full Expo (Only for approved users) -->
    <section v-if="ticket && ticket.status === 'approved' && showFullExpo" class="full-expo">
      <h2 class="cinematic-font text-center">Exposição Completa</h2>
      <div class="expo-gallery">
        <div class="expo-item" v-for="img in allImages" :key="img">
          <img :src="`/images/${img}`" :alt="img" @click="openLightbox(img)" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { notify } from '../utils/swal'

const auth = useAuthStore()
const ticket = ref(null)
const loading = ref(false)
const showFullExpo = ref(false)

const previewImages = ['hero.jpg', 'flamingos.jpg', 'sunset.jpg', 'palm_sunset.jpg', 'ocean_waves.jpg', 'coastal_tower.jpg']
const allImages = ['hero.jpg', 'portrait_bw.png', 'flamingos.jpg', 'sunset.jpg', 'child_boat.jpg', 'kite_sky.png', 'palm_sunset.jpg', 'beach_carry.jpg', 'palm_moon.jpg', 'coastal_tower.jpg', 'ocean_waves.jpg']

const fetchTicket = async () => {
  if (!auth.isAuthenticated) return
  try {
    const res = await axios.get('http://localhost:5000/api/expo/my-ticket', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    ticket.value = res.data
  } catch (err) {
    // No ticket yet
  }
}

const initPurchase = async () => {
  loading.value = true
  try {
    const res = await axios.post('http://localhost:5000/api/expo/purchase', {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    ticket.value = res.data
    notify.success('Bilhete Criado!', 'Agora faz o pagamento e envia o comprovativo.')
  } catch (err) {
    notify.error('Erro', err.response?.data?.message || 'Erro ao criar bilhete')
  } finally {
    loading.value = false
  }
}

const uploadProof = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('proof', file)

  try {
    const res = await axios.post('http://localhost:5000/api/expo/upload-proof', formData, {
      headers: { 
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    ticket.value = res.data.ticket
    notify.success('Enviado!', 'Comprovativo enviado com sucesso.')
  } catch (err) {
    notify.error('Erro', 'Erro ao enviar comprovativo')
  }
}

const enterExpo = () => {
  showFullExpo.value = true
  document.querySelector('.full-expo')?.scrollIntoView({ behavior: 'smooth' })
}

const openLightbox = (img) => {
  // Future: Implement lightbox
}

onMounted(fetchTicket)
</script>

<style scoped>
.expo-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Hero */
.expo-hero {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.expo-hero-bg {
  position: absolute;
  inset: 0;
  background: url('/images/flamingos.jpg') center/cover;
  filter: blur(2px);
  transform: scale(1.1);
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.2); }
}

.expo-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(192,57,43,0.5));
}

.expo-hero-content {
  position: relative;
  z-index: 2;
}

.expo-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--accent);
  color: white;
  border-radius: 30px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.expo-hero-content h1 {
  font-size: 4rem;
  color: white;
  margin-bottom: 1rem;
}

.shimmer-text {
  background: linear-gradient(90deg, #fff, var(--accent), #fff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s ease infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.expo-subtitle {
  font-size: 1.3rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2rem;
}

.expo-price-tag {
  display: inline-flex;
  flex-direction: column;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}

.expo-price-tag .price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent);
}

.expo-price-tag .label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
}

/* Preview Section */
.expo-preview {
  padding: 5rem 2rem;
  background: var(--bg-secondary);
}

.preview-text {
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.preview-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px);
  transform: scale(1.1);
}

.blur-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--accent);
}

/* Purchase Section */
.expo-purchase {
  padding: 5rem 2rem;
}

.purchase-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem;
  border-radius: 24px;
  background: rgba(20,20,20,0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.purchase-card h2 {
  color: white;
  margin-bottom: 2rem;
}

.price-display {
  margin-bottom: 2rem;
}

.price-display .currency {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.price-display .amount {
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent);
}

.btn-primary {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--accent), #e74c3c);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(231,76,60,0.4);
}

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

/* Payment Methods */
.payment-methods {
  margin: 2rem 0;
  text-align: left;
}

.payment-methods h3 {
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.method-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.method-icon.emola { background: linear-gradient(135deg, #e60000, #ff3333); }
.method-icon.mpesa { background: linear-gradient(135deg, #00a651, #00d46a); }
.method-icon.bim { background: linear-gradient(135deg, #003366, #0066cc); }
.method-icon.paypal { background: linear-gradient(135deg, #003087, #009cde); }

.method-info {
  display: flex;
  flex-direction: column;
}

.method-name {
  font-weight: 600;
  color: white;
}

.method-number {
  font-size: 1.1rem;
  color: var(--accent);
  font-family: monospace;
}

.method-owner {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Upload */
.upload-section {
  margin-top: 2rem;
}

.upload-section h3 {
  color: white;
  margin-bottom: 1rem;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(255,255,255,0.1);
  border: 2px dashed var(--accent);
  border-radius: 12px;
  color: var(--accent);
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: rgba(231,76,60,0.2);
}

/* Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-badge.pending {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.proof-submitted {
  margin-top: 2rem;
  color: #2ecc71;
}

.proof-submitted i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Access Granted */
.access-granted, .access-denied {
  text-align: center;
}

.success-icon, .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-icon { color: #2ecc71; }
.error-icon { color: #e74c3c; }

.access-granted h3 { color: #2ecc71; }
.access-denied h3 { color: #e74c3c; }

/* Full Expo */
.full-expo {
  padding: 5rem 2rem;
  background: var(--bg-secondary);
}

.expo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 3rem auto 0;
}

.expo-item {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.expo-item:hover {
  transform: scale(1.02);
}

.expo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Login Prompt */
.login-prompt {
  color: var(--text-secondary);
}

.login-prompt .btn-primary {
  margin: 1.5rem 0 1rem;
}

.login-prompt a {
  color: var(--accent);
}

.mt-1 { margin-top: 0.5rem; }
.text-center { text-align: center; }

@media (max-width: 768px) {
  .expo-hero-content h1 { font-size: 2.5rem; }
  .preview-grid { grid-template-columns: repeat(2, 1fr); }
  .purchase-card { margin: 0 1rem; padding: 2rem; }
  .methods-grid { grid-template-columns: 1fr; }
}

/* Payment Hero - Modern Clean Design */
.payment-hero {
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08));
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.payment-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
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
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.payment-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.pay-card {
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.pay-card:hover {
  transform: translateY(-5px) scale(1.02);
}

.emola-card {
  background: linear-gradient(135deg, #e60000, #ff4444);
  box-shadow: 0 10px 30px rgba(230, 0, 0, 0.3);
}

.mpesa-card {
  background: linear-gradient(135deg, #00a651, #00d46a);
  box-shadow: 0 10px 30px rgba(0, 166, 81, 0.3);
}

.bim-card {
  background: linear-gradient(135deg, #003366, #0066cc);
  box-shadow: 0 10px 30px rgba(0, 51, 102, 0.3);
}

.paypal-card {
  background: linear-gradient(135deg, #003087, #009cde);
  box-shadow: 0 10px 30px rgba(0, 48, 135, 0.3);
}

.pay-icon {
  font-size: 2rem;
  color: white;
  margin-bottom: 0.5rem;
}

.pay-label {
  font-size: 0.9rem;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.pay-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.3rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.pay-name {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
}

.payment-note {
  margin-top: 1.5rem;
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

.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  margin: 2rem 0;
}

@media (max-width: 600px) {
  .payment-cards {
    grid-template-columns: 1fr;
  }
  .pay-number {
    font-size: 1.1rem;
  }
  .payment-logos-grid {
    grid-template-columns: 1fr;
  }
}

/* Official Payment Logos */
.payment-methods-official {
  margin: 1.5rem 0;
  text-align: center;
}

.payment-methods-official h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.payment-logos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-num-small {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-owner {
  font-size: 0.8rem;
  color: #666;
}
</style>

