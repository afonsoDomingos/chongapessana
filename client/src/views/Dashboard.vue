<template>
  <div class="dashboard-page animate-fade">
    <header class="dashboard-header">
      <h1 class="cinematic-font reveal-text">{{ $t('nav.dashboard') }}</h1>
      <div class="welcome-banner glass animate-up">
        <div class="user-info">
          <div class="avatar-circle">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="user-details">
            <h2>{{ $i18n.locale === 'pt' ? 'Bem-vindo de volta,' : 'Welcome back,' }} {{ auth.user?.name }}</h2>
            <p>{{ $i18n.locale === 'pt' ? 'Gerencie seus cursos e progresso aqui.' : 'Manage your courses and progress here.' }}</p>
          </div>
        </div>
      </div>
    </header>

    <section class="my-courses-section">
      <div class="section-header reveal-text delay-1">
        <h3 class="cinematic-font"><i class="fas fa-film"></i> {{ $t('nav.courses') }}</h3>
      </div>
      
      <div v-if="enrollments.length" class="enrollments-grid">
        <div v-for="(enrollment, index) in enrollments" 
             :key="enrollment._id" 
             class="enrollment-card glass animate-up"
             :style="{ animationDelay: (index * 0.1) + 's' }">
          
          <div class="card-body">
            <div class="course-info">
              <span class="category-tag">{{ enrollment.courseId.category || 'Workshop' }}</span>
              <h4>{{ enrollment.courseId.title[$i18n.locale] }}</h4>
              <div class="status-group">
                <span :class="['status-badge', enrollment.status]">
                  <i :class="statusIcon(enrollment.status)"></i>
                  {{ $t(`courses.${enrollment.status}`) }}
                </span>
              </div>
            </div>

            <!-- Pending Flow - WITH PAYMENT METHODS FIRST -->
            <div v-if="enrollment.status === 'pending'" class="action-zone pending">
              
              <!-- Step 1: Show Payment Methods -->
              <div class="payment-step" v-if="!enrollment.proofUrl">
                <h5><i class="fas fa-credit-card"></i> Passo 1: Faz o Pagamento</h5>
                <p class="step-desc">Escolhe um método e envia o valor do curso:</p>
                
                <div class="payment-methods-grid">
                  <div class="pay-method-card">
                    <img src="/images/emola-logo.png" alt="E-Mola" class="pay-logo" />
                    <div class="pay-info">
                      <span class="pay-number">868 497 771</span>
                      <span class="pay-owner">Castigo Alexandre Pessana</span>
                    </div>
                  </div>
                  
                  <div class="pay-method-card">
                    <img src="/images/mpesa-logo.png" alt="M-Pesa" class="pay-logo" />
                    <div class="pay-info">
                      <span class="pay-number">847 877 405</span>
                      <span class="pay-owner">Afonso Domingos</span>
                    </div>
                  </div>
                  
                  <div class="pay-method-card">
                    <img src="/images/visa-logo.png" alt="Visa/BIM" class="pay-logo" />
                    <div class="pay-info">
                      <span class="pay-number-sm">NIB: 0001 0000 0074 3010 49557</span>
                      <span class="pay-owner">Millennium BIM</span>
                    </div>
                  </div>
                  
                  <div class="pay-method-card">
                    <img src="/images/paypal-logo.png" alt="PayPal" class="pay-logo" />
                    <div class="pay-info">
                      <span class="pay-number-sm">karinganastudio23@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Upload Proof -->
              <div class="upload-wrapper" v-if="!enrollment.proofUrl">
                <h5><i class="fas fa-upload"></i> Passo 2: Envia o Comprovativo</h5>
                <p class="step-desc">Após o pagamento, faz upload do comprovativo:</p>
                <label class="custom-file-upload btn-primary glow-effect">
                  <input type="file" @change="(e) => onFileChange(e, enrollment._id)" accept="image/*,application/pdf" />
                  <span><i class="fas fa-cloud-upload-alt"></i> Selecionar Ficheiro</span>
                </label>
              </div>

              <!-- Waiting for validation -->
              <div v-else class="waiting-box">
                <div class="waiting-icon"><i class="fas fa-hourglass-half"></i></div>
                <h5>Comprovativo Enviado!</h5>
                <p><i class="fas fa-clock"></i> {{ $i18n.locale === 'pt' ? 'Aguardando validação do administrador...' : 'Waiting for admin validation...' }}</p>
                <div class="progress-bar-thin"></div>
              </div>
            </div>

            <!-- Approved Flow - ACCESS TO MATERIALS -->
            <div v-if="enrollment.status === 'approved'" class="action-zone approved">
              <div class="access-granted-badge">
                <i class="fas fa-check-circle"></i>
                <span>Acesso Liberado!</span>
              </div>
              
              <h5><i class="fas fa-folder-open"></i> Materiais do Curso</h5>
              
              <div v-if="enrollment.courseId.materials?.length" class="materials-list">
                <a v-for="material in enrollment.courseId.materials" 
                   :key="material._id"
                   :href="material.url" 
                   target="_blank" 
                   class="material-item">
                  <div class="material-icon-wrapper">
                    <i :class="materialIcon(material.type)"></i>
                  </div>
                  <div class="material-info">
                    <span class="material-name">{{ material.title }}</span>
                    <span class="material-type">{{ material.type }}</span>
                  </div>
                  <i class="fas fa-external-link-alt arrow"></i>
                </a>
              </div>
              
              <div v-else class="no-materials-msg">
                <i class="fas fa-hourglass-half"></i>
                <p>Os materiais serão disponibilizados em breve!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state glass animate-up">
        <i class="fas fa-graduation-cap large-icon"></i>
        <p>{{ $i18n.locale === 'pt' ? 'Ainda não estás inscrito em nenhum curso.' : 'You are not enrolled in any courses yet.' }}</p>
        <router-link to="/courses" class="btn-primary glow-effect">
          {{ $i18n.locale === 'pt' ? 'Explorar Cursos' : 'Explore Courses' }}
        </router-link>
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
const enrollments = ref([])

const fetchEnrollments = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/courses/my-courses', {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        enrollments.value = res.data
    } catch (err) {
        console.error(err)
    }
}

const onFileChange = async (e, enrollmentId) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('proof', file)
    formData.append('enrollmentId', enrollmentId)

    try {
        await axios.post('http://localhost:5000/api/courses/upload-proof', formData, {
            headers: { 
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        notify.success('Enviado!', 'Comprovativo enviado com sucesso.')
        fetchEnrollments()
    } catch (err) {
        notify.error('Erro', 'Erro ao enviar comprovativo')
    }
}

const statusIcon = (status) => {
    switch(status) {
        case 'approved': return 'fas fa-check-circle'
        case 'pending': return 'fas fa-hourglass-half'
        case 'rejected': return 'fas fa-exclamation-circle'
        default: return 'fas fa-info-circle'
    }
}

const materialIcon = (type) => {
    switch(type?.toLowerCase()) {
        case 'video': return 'fas fa-play-circle'
        case 'pdf': return 'fas fa-file-pdf'
        case 'image': return 'fas fa-image'
        default: return 'fas fa-file'
    }
}

onMounted(fetchEnrollments)
</script>

<style scoped>
.dashboard-page {
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 4rem;
}

.dashboard-header h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    letter-spacing: 4px;
}

.welcome-banner {
    padding: 2.5rem;
    border-radius: 12px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.avatar-circle {
    width: 80px;
    height: 80px;
    background: var(--accent);
    color: #000;
    font-size: 2.5rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.user-details h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.user-details p {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

.section-header {
    margin-bottom: 2rem;
}

.section-header h3 {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--accent);
    letter-spacing: 2px;
}

.enrollments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
}

.enrollment-card {
    border-radius: 12px;
    transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: flex;
    flex-direction: column;
}

.enrollment-card:hover {
    transform: translateY(-10px);
}

.card-body {
    padding: 2rem;
}

.course-info {
    margin-bottom: 2rem;
}

.course-info h4 {
    font-size: 1.4rem;
    line-height: 1.4;
    margin: 0.8rem 0;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.status-badge.pending { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid #f1c40f; }
.status-badge.approved { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid #2ecc71; }
.status-badge.rejected { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid #e74c3c; }

.action-zone {
    border-top: 1px solid var(--border);
    padding-top: 1.5rem;
}

.instruction-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 1.2rem;
}

.custom-file-upload {
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
}

.custom-file-upload input {
    display: none;
}

.waiting-box {
    text-align: center;
    color: var(--text-secondary);
}

.progress-bar-thin {
    height: 3px;
    background: var(--accent);
    width: 60%;
    margin: 1rem auto 0;
    border-radius: 2px;
    animation: pulseWidth 2s infinite ease-in-out;
}

@keyframes pulseWidth {
    0%, 100% { transform: scaleX(0.5); opacity: 0.3; }
    50% { transform: scaleX(1); opacity: 1; }
}

.approved h5 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--accent);
}

.material-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    color: var(--text-primary);
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
}

.material-item:hover {
    background: rgba(255,255,255,0.1);
    transform: translateX(10px);
}

.material-item .arrow {
    margin-left: auto;
    opacity: 0.3;
}

.empty-state {
    text-align: center;
    padding: 5rem 2rem;
    border-radius: 12px;
}

.large-icon {
    font-size: 4rem;
    color: var(--accent);
    margin-bottom: 2rem;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .dashboard-page { padding: 4rem 1rem; }
    .user-info { flex-direction: column; text-align: center; }
    .enrollments-grid { grid-template-columns: 1fr; }
    .payment-methods-grid { grid-template-columns: 1fr; }
}

/* Payment Methods in Dashboard */
.payment-step {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.payment-step h5 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.payment-step h5 i {
  margin-right: 0.5rem;
  color: #667eea;
}

.step-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.pay-method-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: white;
  border-radius: 12px;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.pay-method-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.pay-logo {
  width: 50px;
  height: 35px;
  object-fit: contain;
}

.pay-info {
  display: flex;
  flex-direction: column;
}

.pay-number {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-number-sm {
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.pay-owner {
  font-size: 0.7rem;
  color: #666;
}

.upload-wrapper h5 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.upload-wrapper h5 i {
  margin-right: 0.5rem;
  color: #667eea;
}

.waiting-box {
  text-align: center;
  padding: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.waiting-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.waiting-box h5 {
  color: #a8b4e8;
  margin-bottom: 0.5rem;
}

.waiting-box p {
  color: var(--text-secondary);
}

/* Approved - Access Granted */
.access-granted-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 30px;
  color: white;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.access-granted-badge i {
  font-size: 1.2rem;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s;
}

.material-item:hover {
  transform: translateX(10px);
  border-color: #667eea;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.material-icon-wrapper {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
}

.material-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.material-name {
  color: white;
  font-weight: 600;
}

.material-type {
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
}

.material-item .arrow {
  color: #667eea;
  opacity: 0.5;
}

.material-item:hover .arrow {
  opacity: 1;
}

.no-materials-msg {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.no-materials-msg i {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.action-zone.approved h5 {
  color: white;
  margin-bottom: 1rem;
}

.action-zone.approved h5 i {
  margin-right: 0.5rem;
  color: #667eea;
}
</style>
