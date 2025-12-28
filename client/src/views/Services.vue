<template>
  <div class="services-page">
    <header class="services-hero">
      <div class="hero-content">
        <h1 class="cinematic-font">Serviços</h1>
        <p>Serviços profissionais de cinematografia e fotografia</p>
      </div>
    </header>

    <section class="services-grid-section">
      <div class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.title">
          <div class="service-image">
            <img :src="service.image" :alt="service.title" />
            <div class="service-overlay"></div>
          </div>
          <div class="service-content">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="services-cta">
      <div class="cta-content">
        <h2 class="cinematic-font">Pronto para começar?</h2>
        <p>Entre em contacto para um orçamento personalizado</p>
        <div class="cta-buttons">
          <a href="https://wa.me/258868497771" target="_blank" class="btn-primary">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
          <a href="mailto:chongapessanask8@gmail.com" class="btn-secondary">
            <i class="fas fa-envelope"></i> Email
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const services = [
  {
    title: 'Filmagem Profissional',
    description: 'Produção de vídeos cinematográficos com equipamento de última geração. Documentários, curtas-metragens e conteúdo criativo.',
    image: '/images/service_filmmaking.png',
    features: ['Cinematografia 4K', 'Edição Profissional', 'Colour Grading']
  },
  {
    title: 'Fotografia Artística',
    description: 'Sessões fotográficas criativas com visão única. Retratos, moda, natureza e fotografia conceptual.',
    image: '/images/service_photography.png',
    features: ['Sessões Personalizadas', 'Edição Premium', 'Alta Resolução']
  },
  {
    title: 'Casamentos',
    description: 'Cobertura completa do seu dia especial. Fotografia e vídeo que capturam cada momento inesquecível.',
    image: '/images/service_wedding.png',
    features: ['Cobertura Completa', 'Filme Cinematográfico', 'Álbum Premium']
  },
  {
    title: 'Eventos Corporativos',
    description: 'Documentação profissional de eventos empresariais, conferências, lançamentos e reuniões corporativas.',
    image: '/images/service_corporate.png',
    features: ['Vídeos Institucionais', 'Cobertura de Eventos', 'Conteúdo para Redes']
  },
  {
    title: 'Cerimónias & Celebrações',
    description: 'Baptizados, formaturas, aniversários e todas as celebrações especiais da sua vida.',
    image: '/images/service_ceremony.png',
    features: ['Cobertura Foto e Vídeo', 'Entrega Rápida', 'Pacotes Flexíveis']
  },
  {
    title: 'Skate & Action Sports',
    description: 'Especialidade em filmagem de desportos radicais, skate e conteúdo de ação com técnicas únicas.',
    image: '/images/service_skate.png',
    features: ['Slow Motion', 'Ângulos Dinâmicos', 'Edição Criativa']
  }
]
</script>

<style scoped>
.services-page {
  min-height: 100vh;
}

.services-hero {
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('/images/hero.jpg') center/cover;
  position: relative;
}

.services-hero h1 {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 0.5rem;
}

.services-hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.services-grid-section {
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.4s;
}

.service-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.service-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.service-card:hover .service-image img {
  transform: scale(1.1);
}

.service-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.8));
}

.service-content {
  padding: 1.5rem;
}

.service-content h3 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
}

.service-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.service-features li {
  background: var(--glass);
  border: 1px solid var(--border);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.services-cta {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #1a0a0a, #0a0a0a);
  text-align: center;
  border-top: 1px solid var(--accent);
}

.cta-content h2 {
  color: white !important;
  margin-bottom: 0.5rem;
}

.cta-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
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
  
  .services-hero h1 {
    font-size: 2.5rem;
  }
}
</style>
