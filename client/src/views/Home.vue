<template>
  <div class="home-page">
    <header class="hero">
      <div class="hero-content animate-up">
        <h1 class="cinematic-font title-reveal">{{ $t('home.title') }}</h1>
        <p class="subtitle-reveal">{{ $t('home.subtitle') }}</p>
        <div class="hero-tags">
          <span class="tag">📸 Fotografia</span>
          <span class="tag">🎬 Cinematografia</span>
          <span class="tag">🛹 Skate</span>
        </div>
        <button class="btn-primary glow-effect">{{ $t('home.cta') }}</button>
      </div>
      <div class="hero-overlay"></div>
    </header>

    <!-- Welcome Section with Scrolling Flags -->
    <section class="welcome-flags-section">
      <p class="welcome-text">🌍 Bem-vindo de todo o mundo! Welcome from around the world! 🌍</p>
      <div class="flags-marquee">
        <div class="flags-track">
          <!-- First set -->
          <span class="flag-item">🇲🇿 Moçambique</span>
          <span class="flag-item">🇵🇹 Portugal</span>
          <span class="flag-item">🇧🇷 Brasil</span>
          <span class="flag-item">🇺🇸 USA</span>
          <span class="flag-item">🇬🇧 UK</span>
          <span class="flag-item">🇫🇷 França</span>
          <span class="flag-item">🇪🇸 Espanha</span>
          <span class="flag-item">🇩🇪 Alemanha</span>
          <span class="flag-item">🇮🇹 Itália</span>
          <span class="flag-item">🇿🇦 África do Sul</span>
          <span class="flag-item">🇦🇴 Angola</span>
          <span class="flag-item">🇨🇻 Cabo Verde</span>
          <span class="flag-item">🇯🇵 Japão</span>
          <span class="flag-item">🇨🇳 China</span>
          <span class="flag-item">🇰🇷 Coreia do Sul</span>
          <span class="flag-item">🇦🇺 Austrália</span>
          <span class="flag-item">🇨🇦 Canadá</span>
          <span class="flag-item">🇲🇽 México</span>
          <span class="flag-item">🇦🇷 Argentina</span>
          <span class="flag-item">🇨🇱 Chile</span>
          <!-- Duplicate for seamless loop -->
          <span class="flag-item">🇲🇿 Moçambique</span>
          <span class="flag-item">🇵🇹 Portugal</span>
          <span class="flag-item">🇧🇷 Brasil</span>
          <span class="flag-item">🇺🇸 USA</span>
          <span class="flag-item">🇬🇧 UK</span>
          <span class="flag-item">🇫🇷 França</span>
          <span class="flag-item">🇪🇸 Espanha</span>
          <span class="flag-item">🇩🇪 Alemanha</span>
          <span class="flag-item">🇮🇹 Itália</span>
          <span class="flag-item">🇿🇦 África do Sul</span>
          <span class="flag-item">🇦🇴 Angola</span>
          <span class="flag-item">🇨🇻 Cabo Verde</span>
          <span class="flag-item">🇯🇵 Japão</span>
          <span class="flag-item">🇨🇳 China</span>
          <span class="flag-item">🇰🇷 Coreia do Sul</span>
          <span class="flag-item">🇦🇺 Austrália</span>
          <span class="flag-item">🇨🇦 Canadá</span>
          <span class="flag-item">🇲🇽 México</span>
          <span class="flag-item">🇦🇷 Argentina</span>
          <span class="flag-item">🇨🇱 Chile</span>
        </div>
      </div>
    </section>

    <section id="bio" class="bio-section">
      <div class="bio-container">
        <div class="bio-img scroll-reveal">
          <img src="/images/chonga_bio.jpg" alt="Chonga Pessana" />
          <div class="img-frame"></div>
        </div>
        <div class="bio-text">
          <h2 class="cinematic-font scroll-reveal title-reveal">{{ $t('bio.title') }}</h2>
          <p class="scroll-reveal delay-1">{{ $t('bio.summary') }}</p>
          <button @click="showFullBio = true" class="btn-link-accent scroll-reveal delay-2">
            <i class="fas fa-plus-circle"></i> {{ $t('bio.readMore') }}
          </button>
          
          <div class="social-links-grid scroll-reveal delay-3">
            <a href="https://www.youtube.com/@ChongaPessana" target="_blank" class="social-btn youtube">
              <i class="fab fa-youtube"></i>
            </a>
            <a href="#" target="_blank" class="social-btn instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" class="social-btn vimeo">
              <i class="fab fa-vimeo-v"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="portfolio-preview">
        <h2 class="cinematic-font text-center mt-5 shimmer-title">Featured Works</h2>
        
        <div class="filter-bar animate-fade">
            <button 
                v-for="cat in categories" 
                :key="cat" 
                @click="selectCategory(cat)"
                :class="{ active: selectedCategory === cat }"
                class="filter-btn"
            >
                {{ cat }}
            </button>
        </div>

        <!-- Scrolling Gallery Columns -->
        <div class="gallery-scroll-container">
            <div class="scroll-column scroll-left">
                <div class="scroll-track">
                    <div 
                        v-for="(work, index) in leftColumnWorks" 
                        :key="'left-' + work.src + index" 
                        class="scroll-item"
                    >
                        <img :src="work.src" :alt="work.alt" />
                        <div class="item-overlay">
                            <span class="category-tag">{{ work.category }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scroll-column scroll-right">
                <div class="scroll-track">
                    <div 
                        v-for="(work, index) in rightColumnWorks" 
                        :key="'right-' + work.src + index" 
                        class="scroll-item"
                    >
                        <img :src="work.src" :alt="work.alt" />
                        <div class="item-overlay">
                            <span class="category-tag">{{ work.category }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Paginated Grid with Smooth Transitions -->
        <h3 class="cinematic-font text-center mt-4">Explore Gallery</h3>
        <TransitionGroup name="gallery-shuffle" tag="div" class="gallery-grid">
            <div 
                v-for="(work, index) in paginatedWorks" 
                :key="work.src" 
                class="gallery-item" 
            >
                <img :src="work.src" :alt="work.alt" />
                <div class="item-overlay">
                    <span class="category-tag">{{ work.category }}</span>
                </div>
            </div>
        </TransitionGroup>

        <!-- Pagination Controls -->
        <div class="pagination" v-if="totalPages > 1">
            <button 
                class="page-btn" 
                :disabled="currentPage === 1" 
                @click="currentPage--"
            >
                <i class="fas fa-chevron-left"></i>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
                class="page-btn" 
                :disabled="currentPage === totalPages" 
                @click="currentPage++"
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="team-header scroll-reveal">
        <span class="section-badge">🤝 A EQUIPE</span>
        <h2 class="cinematic-font">Quem Faz Acontecer</h2>
        <p class="team-subtitle">Os profissionais por trás da magia cinematográfica</p>
      </div>
      
      <div class="team-grid">
        <!-- Chonga - Main Artist -->
        <div class="team-card main-artist scroll-reveal">
          <div class="card-glow"></div>
          <div class="team-avatar">
            <img src="/images/chonga_bio.jpg" alt="Chonga Pessana" />
            <div class="status-indicator online"></div>
          </div>
          <div class="team-info">
            <h3>Chonga Pessana</h3>
            <span class="role-badge artist">🎬 Artista Principal</span>
            <p class="team-desc">Cineasta, fotógrafo e skater profissional. A visão criativa por trás de cada projeto.</p>
            <div class="contact-methods">
              <a href="tel:+258868497771" class="contact-btn phone">
                <i class="fas fa-phone"></i>
                <span>+258 86 849 7771</span>
              </a>
              <a href="mailto:chongapessanask8@gmail.com" class="contact-btn email">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Vibe - Agent/Partner -->
        <div class="team-card agent scroll-reveal delay-1">
          <div class="card-glow purple"></div>
          <div class="team-avatar">
            <img src="/images/vibe_agent.jpg" alt="Vibe - Afonso Domingos" />
            <div class="status-indicator available"></div>
          </div>
          <div class="team-info">
            <h3>Vibe <span class="aka">(Afonso Domingos)</span></h3>
            <span class="role-badge agent">📞 Agente & Parceiro</span>
            <p class="team-desc">Contacto alternativo. Se o Chonga estiver indisponível, eu trato de tudo!</p>
            <div class="availability-note">
              <i class="fas fa-headset"></i>
              <span>Disponível 24/7</span>
            </div>
            <div class="contact-methods">
              <a href="tel:+258847877405" class="contact-btn phone purple">
                <i class="fas fa-phone"></i>
                <span>+258 84 787 7405</span>
              </a>
              <a href="https://wa.me/258847877405" target="_blank" class="contact-btn whatsapp">
                <i class="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          <div class="agent-badge">
            <i class="fas fa-shield-alt"></i>
            <span>Representante Oficial</span>
          </div>
        </div>
      </div>

      <div class="team-footer scroll-reveal delay-2">
        <p>💡 <strong>Dica:</strong> Não consegues falar com o Chonga? O Vibe está sempre disponível para te ajudar!</p>
      </div>
    </section>


    <section class="video-section animate-up">
        <h2 class="cinematic-font text-center">Portfolio - Videos</h2>
        <div class="video-grid">
            <div class="video-item">
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/s2LGxRqJrcs" title="Chonga Pessana - Featured Work" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        <div class="text-center mt-2">
            <a href="https://www.youtube.com/@ChongaPessana/videos" target="_blank" class="btn-primary">Ver Mais no YouTube</a>
        </div>
    </section>

    <!-- Full Bio Modal -->
    <div v-if="showFullBio" class="modal-overlay animate-fade" @click.self="showFullBio = false">
      <div class="modal-content glass animate-up">
        <button class="modal-close" @click="showFullBio = false">&times;</button>
        <h2 class="cinematic-font">{{ $t('bio.title') }}</h2>
        <div class="bio-full-text">
          <p v-for="(para, i) in $t('bio.full').split('\n\n')" :key="i">{{ para }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const showFullBio = ref(false)
const selectedCategory = ref('All')
const currentPage = ref(1)
const itemsPerPage = 9

// Intersection Observer for scroll animations
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      } else {
        // Remove class when out of view so it re-animates
        entry.target.classList.remove('visible')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })
  
  // Observe all scroll-reveal elements
  document.querySelectorAll('.scroll-reveal, .title-reveal, .subtitle-reveal').forEach(el => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const categories = ['All', 'Cinematography', 'Photography', 'Nature', 'Documentary']

const works = [
  { src: '/images/hero.jpg', alt: 'Epic Landscape', category: 'Cinematography' },
  { src: '/images/portrait_bw.png', alt: 'Artist Portrait', category: 'Photography' },
  { src: '/images/flamingos.jpg', alt: 'Flamingos in Wild', category: 'Nature' },
  { src: '/images/sunset.jpg', alt: 'Golden Hour', category: 'Nature' },
  { src: '/images/child_boat.jpg', alt: 'Coastal Life', category: 'Documentary' },
  { src: '/images/kite_sky.png', alt: 'Freedom', category: 'Documentary' },
  { src: '/images/palm_sunset.jpg', alt: 'Silhouette', category: 'Nature' },
  { src: '/images/beach_carry.jpg', alt: 'Local Traditions', category: 'Documentary' },
  { src: '/images/palm_moon.jpg', alt: 'Lunar Night', category: 'Photography' },
  { src: '/images/coastal_tower.jpg', alt: 'Old Ruins', category: 'Cinematography' },
  { src: '/images/ocean_waves.jpg', alt: 'Ocean Waves', category: 'Nature' },
]

const filteredWorks = computed(() => {
  if (selectedCategory.value === 'All') return shuffledWorks.value
  return shuffledWorks.value.filter(w => w.category === selectedCategory.value)
})

// Shuffled works with periodic re-shuffle
const shuffledWorks = ref([...works])
let shuffleInterval = null

const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const doShuffle = () => {
  shuffledWorks.value = shuffleArray(works)
}

onMounted(() => {
  // Initial shuffle
  doShuffle()
  
  // Shuffle every 8 seconds
  shuffleInterval = setInterval(() => {
    doShuffle()
  }, 8000)
})

onUnmounted(() => {
  if (shuffleInterval) {
    clearInterval(shuffleInterval)
  }
})

// Split works for scrolling columns
const leftColumnWorks = computed(() => {
  const items = filteredWorks.value.filter((_, i) => i % 2 === 0)
  return [...items, ...items] // Duplicate for infinite scroll
})

const rightColumnWorks = computed(() => {
  const items = filteredWorks.value.filter((_, i) => i % 2 === 1)
  return [...items, ...items] // Duplicate for infinite scroll
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredWorks.value.length / itemsPerPage))

const paginatedWorks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredWorks.value.slice(start, end)
})

const selectCategory = (cat) => {
  selectedCategory.value = cat
  currentPage.value = 1
}
</script>


<style scoped>
.hero {
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/images/hero.jpg') center/cover;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15vh;
    background: linear-gradient(transparent, var(--bg-primary));
}

.hero h1 {
  font-size: 5rem;
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 0 0 20px rgba(0,0,0,0.8);
}

/* Scroll-triggered animations */
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal.delay-1 { transition-delay: 0.15s; }
.scroll-reveal.delay-2 { transition-delay: 0.3s; }
.scroll-reveal.delay-3 { transition-delay: 0.45s; }

/* Title reveal with special effect */
.title-reveal {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  background: linear-gradient(135deg, var(--accent), #ff6b6b, var(--accent));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

.title-reveal.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Subtitle reveal */
.subtitle-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.subtitle-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.hero p {
  font-size: 1.8rem;
  color: #eee;
  margin-bottom: 1.5rem;
  font-weight: 300;
  letter-spacing: 2px;
}

.hero-tags {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.hero-tags .tag {
  padding: 0.5rem 1.2rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  color: white;
  font-size: 0.9rem;
  border: 1px solid rgba(255,255,255,0.2);
}

/* Welcome Flags Section - Scrolling Marquee */
.welcome-flags-section {
  padding: 1.5rem 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-bottom: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}

.welcome-text {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.flags-marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}

.flags-track {
  display: flex;
  gap: 2rem;
  animation: scrollFlags 40s linear infinite;
  width: max-content;
}

.flags-track:hover {
  animation-play-state: paused;
}

.flag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s;
}

.flag-item:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  transform: scale(1.05);
}

@keyframes scrollFlags {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.btn-primary {
  padding: 1.2rem 2.5rem;
  background: var(--accent);
  border: none;
  color: #000;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.glow-effect:hover {
    box-shadow: 0 0 25px var(--accent);
    transform: translateY(-5px);
}

.reveal-effect {
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow);
    border-radius: 4px;
}

.reveal-effect img {
    transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.reveal-effect:hover img {
    transform: scale(1.08);
}

.img-frame {
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 1px solid rgba(255,255,255,0.2);
    pointer-events: none;
}

.reveal-text {
    opacity: 0;
    animation: fadeInUp 0.8s ease forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }

.social-links-grid {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.social-btn {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-size: 1.2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
}

.social-btn:hover {
    transform: translateY(-5px) scale(1.1);
    color: #fff;
    border-color: var(--accent);
}

.youtube:hover { background: #ff0000; box-shadow: 0 5px 15px rgba(255, 0, 0, 0.4); }
.instagram:hover { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); box-shadow: 0 5px 15px rgba(220, 39, 67, 0.4); }
.vimeo:hover { background: #1ab7ea; box-shadow: 0 5px 15px rgba(26, 183, 234, 0.4); }

/* Grain Effect */
.home-page::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://grainy-gradients.vercel.app/noise.svg');
    opacity: 0.05;
    pointer-events: none;
    z-index: 5000;
}

.filter-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 3rem 0 1rem;
    flex-wrap: wrap;
}

.filter-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 0.6rem 1.5rem;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s;
}

.filter-btn:hover, .filter-btn.active {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
    box-shadow: 0 0 15px var(--accent);
}

.item-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2.5rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: flex-end;
    transform: translateY(20px);
    z-index: 2;
}

.gallery-item:hover .item-overlay {
    opacity: 1;
    transform: translateY(0);
}

.category-tag {
    color: #fff;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 0.5rem 1.2rem;
    background: linear-gradient(135deg, var(--accent), #e74c3c);
    border-radius: 30px;
    box-shadow: 0 5px 20px rgba(231,76,60,0.5);
    animation: pulseTag 2s ease-in-out infinite;
}

@keyframes pulseTag {
    0%, 100% { box-shadow: 0 5px 20px rgba(231,76,60,0.5); }
    50% { box-shadow: 0 5px 30px rgba(231,76,60,0.8); }
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.list-move {
  transition: transform 0.5s ease;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    padding: 5rem 2rem;
    perspective: 1000px;
}

.gallery-item {
    overflow: hidden;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    position: relative;
    transform-style: preserve-3d;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.gallery-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(231,76,60,0) 0%, rgba(231,76,60,0.3) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
    pointer-events: none;
}

.gallery-item::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg) translateY(100%);
    transition: transform 0.8s ease;
    pointer-events: none;
}

.gallery-item:hover::after {
    transform: rotate(45deg) translateY(-100%);
}

.gallery-item:hover::before {
    opacity: 1;
}

.gallery-item:hover {
    transform: translateY(-15px) rotateX(5deg);
    box-shadow: 
        0 30px 60px rgba(0,0,0,0.4),
        0 0 50px rgba(231,76,60,0.2);
    border-color: var(--accent);
}

.gallery-item img {
    width: 100%;
    height: 450px;
    object-fit: cover;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    display: block;
    filter: grayscale(30%) contrast(1.1);
}

.gallery-item:hover img {
    transform: scale(1.15);
    filter: grayscale(0%) contrast(1.2) saturate(1.2);
}

.bio-section {
  padding: 8rem 2rem;
  background: var(--bg-primary);
}
.bio-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 4rem;
}
.bio-img {
  flex: 1;
}
.bio-img img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.bio-text {
  flex: 1.5;
}
.bio-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--accent);
}
.bio-text p {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.btn-link-accent {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  margin-bottom: 2rem;
  display: block;
}

.video-section {
    padding: 8rem 2rem;
    background: var(--bg-secondary);
}

.video-grid {
    max-width: 1000px;
    margin: 3rem auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

.video-item {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2rem;
}
.modal-content {
  max-width: 800px;
  max-height: 80vh;
  padding: 3rem;
  border-radius: 8px;
  position: relative;
  overflow-y: auto;
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}
.bio-full-text p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1.1rem;
}

.modal-content h2 {
  color: #ffffff;
  margin-bottom: 1.5rem;
}
.mt-2 { margin-top: 1rem; }
.text-center { text-align: center; }

@media (max-width: 768px) {
  .hero h1 { font-size: 3rem; }
  .bio-container {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  .gallery-scroll-container {
    flex-direction: column;
    height: auto;
  }
  .scroll-column {
    height: 300px;
  }
}

/* Shimmer Title */
.shimmer-title {
  background: linear-gradient(90deg, var(--text-primary), var(--accent), var(--text-primary));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerText 4s ease infinite;
}

@keyframes shimmerText {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Scrolling Gallery Columns */
.gallery-scroll-container {
  display: flex;
  gap: 1rem;
  height: 500px;
  overflow: hidden;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.scroll-column {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-radius: 16px;
}

.scroll-track {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scroll-left .scroll-track {
  animation: scrollUp 30s linear infinite;
}

.scroll-right .scroll-track {
  animation: scrollDown 30s linear infinite;
}

@keyframes scrollUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@keyframes scrollDown {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

.scroll-column:hover .scroll-track {
  animation-play-state: paused;
}

.scroll-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  height: 250px;
}

.scroll-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.scroll-item:hover img {
  transform: scale(1.1);
}

.scroll-item .item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-item:hover .item-overlay {
  opacity: 1;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
}

.page-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #e74c3c);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(231,76,60,0.3);
}

.page-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(231,76,60,0.5);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  padding: 0.5rem 1.5rem;
  background: var(--glass);
  border-radius: 30px;
  border: 1px solid var(--border);
}

.mt-4 {
  margin-top: 3rem;
}

/* Gallery Shuffle Transition - Smooth */
.gallery-shuffle-move {
  transition: all 1.2s ease-in-out;
}

.gallery-shuffle-enter-active,
.gallery-shuffle-leave-active {
  transition: all 0.8s ease-in-out;
}

.gallery-shuffle-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.gallery-shuffle-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Services Section */
.services-section {
  padding: 5rem 2rem;
  background: var(--bg-primary);
}

.services-header {
  text-align: center;
  margin-bottom: 3rem;
}

.services-header h2 {
  color: white;
  margin-bottom: 0.5rem;
}

.services-subtitle {
  color: var(--text-secondary);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  padding: 2rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  transition: all 0.3s;
}

.service-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: var(--accent);
  transform: translateY(-5px);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
}

.service-card p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-features li {
  color: var(--text-secondary);
  font-size: 0.8rem;
  padding: 0.3rem 0;
  padding-left: 1.2rem;
  position: relative;
}

.service-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.services-cta {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.services-cta p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.services-cta .btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 992px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}

/* Team Section - Corporate Design */
.team-section {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a0a0a 100%);
  position: relative;
  overflow: hidden;
}

.team-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.team-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.team-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--accent);
  color: white;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.team-header h2 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.team-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.team-card {
  position: relative;
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255,255,255,0.02);
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.3s;
}

.team-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: var(--accent);
  transform: translateY(-5px);
}

.card-glow {
  display: none;
}

.team-avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
}

.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid var(--accent);
}

.team-card.agent .team-avatar img {
  border-color: var(--text-secondary);
}

.status-indicator {
  display: none;
}

.team-info {
  text-align: left;
  flex: 1;
}

.team-info h3 {
  color: white;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
}

.team-info h3 .aka {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 400;
  display: block;
}

.role-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.role-badge.artist {
  background: var(--accent);
  color: white;
}

.role-badge.agent {
  background: rgba(255,255,255,0.1);
  color: var(--text-secondary);
}

.team-desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.availability-note {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2px;
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 0.8rem;
}

.contact-methods {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border-radius: 2px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: var(--text-secondary);
}

.contact-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.contact-btn.phone {
  background: transparent;
  color: var(--text-secondary);
}

.contact-btn.phone.purple {
  background: transparent;
  color: var(--text-secondary);
}

.contact-btn.email {
  background: transparent;
}

.contact-btn.whatsapp {
  background: transparent;
}

.agent-badge {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  background: var(--accent);
  border-radius: 2px;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.team-footer {
  text-align: center;
  margin-top: 3rem;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.team-footer p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.team-footer strong {
  color: var(--accent);
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .team-card {
    flex-direction: column;
    text-align: center;
  }
  
  .team-avatar {
    margin: 0 auto 1rem;
  }
  
  .team-info {
    text-align: center;
  }
  
  .contact-methods {
    justify-content: center;
  }
  
  .agent-badge {
    position: relative;
    top: 0;
    right: 0;
    margin-top: 1rem;
    justify-content: center;
  }
}
</style>

