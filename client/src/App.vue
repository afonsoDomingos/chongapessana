<template>
  <div id="app" :data-theme="theme">
    <nav class="navbar glass">
      <div class="nav-brand cinematic-font">Chonga Pessana</div>
      <div class="nav-links">
        <router-link to="/">{{ $t('nav.home') }}</router-link>
        <router-link to="/services">Serviços</router-link>
        <router-link to="/courses">{{ $t('nav.courses') }}</router-link>
        <router-link to="/expo" class="expo-link">🎨 Expo Digital</router-link>
        <template v-if="!auth.isAuthenticated">
          <router-link to="/login">{{ $t('nav.login') }}</router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard">{{ $t('nav.dashboard') }}</router-link>
          <router-link v-if="auth.isAdmin" to="/admin">Admin</router-link>
          <button @click="logout" class="btn-link">Logout</button>
        </template>
        <button @click="toggleTheme" class="btn-icon">
          <span v-if="theme === 'light'">🌙</span>
          <span v-else>☀️</span>
        </button>
        <select v-model="$i18n.locale" @change="saveLang" class="lang-select">
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </select>
      </div>
    </nav>
    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Partners Section -->
    <section class="partners-section">
      <p class="partners-title partner-animate">PARCEIROS</p>
      <div class="partners-grid">
        <a href="https://recuperaaqui.vercel.app/" target="_blank" class="partner-card partner-animate" style="animation-delay: 0.1s">
          <img src="/images/partner_recupereaqui.png" alt="Recupere Aqui" />
          <span>Recupere Aqui</span>
        </a>
        <a href="#" class="partner-card partner-animate" style="animation-delay: 0.2s">
          <img src="/images/partner_outofthebox.png" alt="Out of the Box ASM" />
          <span>Out of the Box</span>
        </a>
        <a href="#" class="partner-card partner-animate" style="animation-delay: 0.3s">
          <img src="/images/partner_techvibe.png" alt="TechVibe" />
          <span>TechVibe</span>
        </a>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 Chonga Pessana. All rights reserved.</p>
        <p class="contact-info">
          <span>{{ $t('contact.email') }}: karinganastudio23@gmail.com / chongapessanask8@gmail.com</span> | 
          <span>{{ $t('contact.phone') }}: +258 86 849 7771</span> | 
          <span>{{ $t('contact.agent') }}: +258 84 787 7405</span>
        </p>
        <p>Created by <a href="https://www.linkedin.com/in/afonso-domingos-6b59361a5/" target="_blank" class="vibe-link">Vibe</a></p>
      </div>
    </footer>

    <!-- WhatsApp Floating Button -->
    <a href="https://wa.me/258868497771?text=Olá! Gostaria de saber mais sobre os cursos de Chonga Pessana" 
       target="_blank" 
       class="whatsapp-float"
       title="Falar no WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const theme = ref(localStorage.getItem('theme') || 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

const saveLang = (event) => {
  localStorage.setItem('lang', event.target.value)
}

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.nav-links a {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: color 0.3s;
}
.nav-links a:hover {
  color: var(--accent);
}
.btn-icon, .btn-link, .lang-select {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1rem;
}
.content {
  min-height: calc(100vh - 160px);
}
.footer {
  padding: 2rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-secondary);
}
.footer-content p {
  margin: 0.5rem 0;
}
.contact-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.contact-info span {
  margin: 0 0.5rem;
}
.vibe-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: bold;
}
.vibe-link:hover {
  text-decoration: underline;
}

/* WhatsApp Floating Button */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  text-decoration: none;
  box-shadow: 0 5px 25px rgba(37, 211, 102, 0.5);
  z-index: 9999;
  transition: all 0.3s;
  animation: pulse-whatsapp 2s ease-in-out infinite;
}

.whatsapp-float:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 10px 35px rgba(37, 211, 102, 0.6);
}

@keyframes pulse-whatsapp {
  0%, 100% { box-shadow: 0 5px 25px rgba(37, 211, 102, 0.5); }
  50% { box-shadow: 0 5px 35px rgba(37, 211, 102, 0.8); }
}

/* Partners Section */
.partners-section {
  padding: 4rem 2rem;
  background: #ffffff;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Artistic Top Border - Animated Gradient */
.partners-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--accent), 
    #ff6b6b, 
    var(--accent), 
    #ffb347,
    var(--accent),
    transparent
  );
  background-size: 400% 100%;
  animation: borderFlow 8s linear infinite;
}

/* Artistic Bottom Border - Animated Gradient */
.partners-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, 
    transparent, 
    #ffb347,
    var(--accent), 
    #ff6b6b, 
    var(--accent), 
    transparent
  );
  background-size: 400% 100%;
  animation: borderFlow 8s linear infinite reverse;
}

@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 400% 50%; }
}

.partners-title {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 5px;
  color: #333;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.partners-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), #ff6b6b, var(--accent));
  border-radius: 2px;
}

.partners-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.3s;
  padding: 1rem;
  border-radius: 8px;
}

.partner-card:hover {
  transform: translateY(-5px);
  background: rgba(231, 76, 60, 0.05);
  box-shadow: 0 10px 30px rgba(231, 76, 60, 0.2);
}

.partner-card img {
  height: 70px;
  width: auto;
  object-fit: contain;
  filter: grayscale(50%);
  opacity: 0.8;
  transition: all 0.3s;
}

.partner-card:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

.partner-card span {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.partner-card:hover span {
  color: var(--accent);
}

@media (max-width: 600px) {
  .partners-grid {
    gap: 1.5rem;
  }
  
  .partner-card img {
    height: 45px;
  }
}

/* Partner Zoom Animation */
.partner-animate {
  animation: partnerZoomIn 0.8s ease-out both;
}

@keyframes partnerZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.partner-card img {
  transition: transform 0.4s ease;
}

.partner-card:hover img {
  transform: scale(1.15);
}
</style>
