<template>
  <div class="auth-page">
    <div class="auth-bg"></div>
    <div class="auth-overlay"></div>
    
    <!-- Floating Particles -->
    <div class="particles">
      <span v-for="n in 20" :key="n" class="particle" :style="{ '--i': n }"></span>
    </div>
    
    <div class="auth-card glass animate-up">
      <div class="auth-logo pulse-glow">
        <i class="fas fa-user-plus"></i>
      </div>
      <h2 class="cinematic-font shimmer-text">{{ $t('nav.register') }}</h2>
      <p class="auth-subtitle">Junta-te à comunidade cinematográfica global</p>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group animate-slide" style="--delay: 0.1s">
          <label><i class="fas fa-user"></i> Nome Completo</label>
          <input v-model="name" type="text" placeholder="O teu nome" required />
          <div class="input-glow"></div>
        </div>
        <div class="form-group animate-slide" style="--delay: 0.15s">
          <label><i class="fas fa-envelope"></i> Email</label>
          <input v-model="email" type="email" placeholder="seu@email.com" required />
          <div class="input-glow"></div>
        </div>
        <div class="form-group animate-slide" style="--delay: 0.2s">
          <label><i class="fas fa-globe-africa"></i> País</label>
          <select v-model="country" required class="country-select">
            <option value="" disabled>Seleciona o teu país</option>
            <option value="Mozambique">🇲🇿 Moçambique</option>
            <option value="Portugal">🇵🇹 Portugal</option>
            <option value="Brazil">🇧🇷 Brasil</option>
            <option value="South Africa">🇿🇦 África do Sul</option>
            <option value="Angola">🇦🇴 Angola</option>
            <option value="Cape Verde">🇨🇻 Cabo Verde</option>
            <option value="Guinea-Bissau">🇬🇼 Guiné-Bissau</option>
            <option value="Timor-Leste">🇹🇱 Timor-Leste</option>
            <option value="Other">🌍 Outro</option>
          </select>
          <div class="input-glow"></div>
        </div>
        <div class="form-group animate-slide" style="--delay: 0.25s">
          <label><i class="fas fa-lock"></i> Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
          <div class="input-glow"></div>
        </div>
        <button type="submit" class="btn-primary animate-slide" style="--delay: 0.3s" :disabled="auth.loading">
          <span v-if="auth.loading"><i class="fas fa-spinner fa-spin"></i></span>
          <span v-else><i class="fas fa-rocket"></i> Criar Conta</span>
          <div class="btn-shine"></div>
        </button>
      </form>
      
      <div class="auth-footer animate-slide" style="--delay: 0.35s">
        <p>Já tens conta? <router-link to="/login">Entrar</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { notify } from '../utils/swal'

const name = ref('')
const email = ref('')
const password = ref('')
const country = ref('Mozambique')
const auth = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  const success = await auth.register({ 
    name: name.value, 
    email: email.value, 
    password: password.value,
    country: country.value
  })
  if (success) {
    notify.success('Conta Criada!', 'Bem-vindo à família Chonga Pessana!')
    router.push('/dashboard')
  } else {
    notify.error('Erro no Registo', 'Não foi possível criar a conta.')
  }
}
</script>

<style scoped>
.auth-page {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  background: url('/images/sunset.jpg') center/cover no-repeat;
  filter: blur(3px);
  transform: scale(1.1);
  z-index: 0;
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.2); }
}

.auth-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.85), rgba(192,57,43,0.5));
  z-index: 1;
}

/* Floating Particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(231, 76, 60, 0.6);
  border-radius: 50%;
  animation: float 15s linear infinite;
  left: calc(var(--i) * 5%);
  top: 100%;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.8);
}

.particle:nth-child(even) {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

.particle:nth-child(1) { animation-delay: 0s; animation-duration: 12s; }
.particle:nth-child(2) { animation-delay: 1s; animation-duration: 15s; }
.particle:nth-child(3) { animation-delay: 2s; animation-duration: 18s; }
.particle:nth-child(4) { animation-delay: 0.5s; animation-duration: 14s; }
.particle:nth-child(5) { animation-delay: 3s; animation-duration: 16s; }
.particle:nth-child(6) { animation-delay: 1.5s; animation-duration: 13s; }
.particle:nth-child(7) { animation-delay: 2.5s; animation-duration: 17s; }
.particle:nth-child(8) { animation-delay: 0.8s; animation-duration: 11s; }
.particle:nth-child(9) { animation-delay: 3.5s; animation-duration: 19s; }
.particle:nth-child(10) { animation-delay: 1.2s; animation-duration: 14s; }

.auth-card {
  position: relative;
  z-index: 2;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.5),
    0 0 100px rgba(231, 76, 60, 0.1);
  text-align: center;
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--accent), #e74c3c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 40px rgba(231,76,60,0.5);
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 10px 40px rgba(231,76,60,0.5); }
  50% { box-shadow: 0 10px 60px rgba(231,76,60,0.8), 0 0 30px rgba(231,76,60,0.4); }
}

.shimmer-text {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #fff, #e74c3c, #fff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.auth-subtitle {
  color: rgba(255,255,255,0.6);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.animate-slide {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.6s ease forwards;
  animation-delay: var(--delay);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: rgba(255,255,255,0.8);
  font-size: 0.85rem;
}

.form-group label i {
  margin-right: 0.5rem;
  color: var(--accent);
}

.form-group input,
.country-select {
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 14px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.4s ease;
  box-sizing: border-box;
}

.country-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

.country-select option {
  background: #1a1a1a;
  color: #fff;
}

.input-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.form-group input:focus + .input-glow,
.country-select:focus + .input-glow {
  width: 100%;
}

.form-group input::placeholder {
  color: rgba(255,255,255,0.3);
}

.form-group input:focus,
.country-select:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 30px rgba(231,76,60,0.25);
  transform: scale(1.02);
}

.btn-primary {
  position: relative;
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, var(--accent), #e74c3c);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 40px rgba(231,76,60,0.35);
  overflow: hidden;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover .btn-shine {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 50px rgba(231,76,60,0.5);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary i {
  margin-right: 0.5rem;
}

.auth-footer {
  margin-top: 1.5rem;
  color: rgba(255,255,255,0.6);
}

.auth-footer a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.auth-footer a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.auth-footer a:hover::after {
  width: 100%;
}

.auth-footer a:hover {
  color: #e74c3c;
  text-shadow: 0 0 10px rgba(231,76,60,0.5);
}

@media (max-width: 480px) {
  .auth-card {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }
  .shimmer-text {
    font-size: 1.6rem;
  }
}
</style>
