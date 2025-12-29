<template>
  <div class="academy-dashboard">
    <!-- Sidebar Navigation -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <div class="user-avatar-large">
          {{ auth.user?.name?.charAt(0) }}
        </div>
        <h3>{{ auth.user?.name }}</h3>
        <p class="user-email">{{ auth.user?.email }}</p>
      </div>
      
      <nav class="sidebar-nav">
        <a href="#" class="nav-item" :class="{ active: !selectedCourse }" @click.prevent="selectedCourse = null">
          <i class="fas fa-play-circle"></i>
          <span>Meus Cursos</span>
          <span class="nav-badge">{{ approvedCourses.length }}</span>
        </a>
        <router-link to="/courses" class="nav-item explore">
          <i class="fas fa-compass"></i>
          <span>Explorar Cursos</span>
        </router-link>
      </nav>
      
      <div class="sidebar-stats">
        <div class="stat-item">
          <span class="stat-number">{{ approvedCourses.length }}</span>
          <span class="stat-label">Cursos Ativos</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalLessonsCompleted }}</span>
          <span class="stat-label">Aulas Concluídas</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Header -->
      <header class="main-header">
        <div class="header-content">
          <h1>Meus Cursos</h1>
          <p>Continue de onde parou ou explore novos cursos</p>
        </div>
        <router-link to="/courses" class="btn-explore">
          <i class="fas fa-plus"></i> Novo Curso
        </router-link>
      </header>

      <!-- Continue Learning Section -->
      <section v-if="approvedCourses.length && !selectedCourse" class="continue-section">
        <h2><i class="fas fa-graduation-cap"></i> Continuar a Aprender</h2>
        
        <div class="courses-grid">
          <div v-for="enrollment in approvedCourses" 
               :key="enrollment._id" 
               class="course-card"
               @click="selectCourse(enrollment)">
            
            <!-- Course Thumbnail -->
            <div class="course-thumbnail">
              <div class="thumbnail-gradient"></div>
              <div class="thumbnail-overlay">
                <i class="fas fa-play"></i>
              </div>
              <div class="course-progress-indicator">
                <div class="progress-ring">
                  <svg viewBox="0 0 36 36">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="circle" :stroke-dasharray="`${getProgress(enrollment)}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span class="progress-text">{{ getProgress(enrollment) }}%</span>
                </div>
              </div>
            </div>
            
            <!-- Course Details -->
            <div class="course-details">
              <span class="course-category">{{ enrollment.courseId.category || 'Workshop' }}</span>
              <h3 class="course-title">{{ enrollment.courseId.title?.pt || enrollment.courseId.title }}</h3>
              
              <div class="course-meta">
                <span><i class="fas fa-book"></i> {{ enrollment.courseId.materials?.length || 0 }} aulas</span>
                <span><i class="fas fa-check-circle"></i> {{ getCompletedCount(enrollment) }} concluídas</span>
              </div>
              
              <div class="course-progress-bar">
                <div class="progress-fill" :style="{ width: getProgress(enrollment) + '%' }"></div>
              </div>
              
              <button class="btn-continue">
                <i class="fas fa-play"></i> Continuar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Pending Courses Section -->
      <section v-if="pendingCourses.length && !selectedCourse" class="pending-section">
        <h2><i class="fas fa-hourglass-half"></i> Aguardando Aprovação</h2>
        
        <div class="pending-courses-list">
          <div v-for="enrollment in pendingCourses" :key="enrollment._id" class="pending-course-card">
            <div class="pending-icon"><i class="fas fa-clock"></i></div>
            <div class="pending-info">
              <h4>{{ enrollment.courseId.title?.pt || enrollment.courseId.title }}</h4>
              <span class="pending-status">Aguardando validação do pagamento</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-if="!enrollments.length && !selectedCourse" class="empty-section">
        <div class="empty-content">
          <i class="fas fa-graduation-cap"></i>
          <h3>Nenhum curso ainda</h3>
          <p>Explore nossos cursos e comece sua jornada de aprendizado</p>
          <router-link to="/courses" class="btn-primary">
            <i class="fas fa-search"></i> Explorar Cursos
          </router-link>
        </div>
      </section>

      <!-- Course Player View -->
      <section v-if="selectedCourse" class="course-player-section">
        <!-- Back Button -->
        <button class="btn-back" @click="selectedCourse = null">
          <i class="fas fa-arrow-left"></i> Voltar aos Cursos
        </button>
        
        <!-- Course Header -->
        <div class="player-header">
          <div class="player-info">
            <span class="player-category">{{ selectedCourse.courseId.category || 'Workshop' }}</span>
            <h2>{{ selectedCourse.courseId.title?.pt || selectedCourse.courseId.title }}</h2>
            <div class="player-progress">
              <div class="progress-bar-player">
                <div class="progress-fill" :style="{ width: getProgress(selectedCourse) + '%' }"></div>
              </div>
              <span>{{ getProgress(selectedCourse) }}% completo</span>
            </div>
          </div>
        </div>
        
        <!-- Course Content Layout -->
        <div class="course-content-layout">
          <!-- Lessons Sidebar -->
          <aside class="lessons-sidebar">
            <div class="sidebar-title">
              <i class="fas fa-list"></i>
              <span>Conteúdo do Curso</span>
            </div>
            
            <div class="lessons-list-sidebar">
              <div v-for="(material, idx) in selectedCourse.courseId.materials" 
                   :key="material._id"
                   class="lesson-sidebar-item"
                   :class="{ 
                     'active': currentLessonIndex === idx,
                     'completed': isLessonCompleted(selectedCourse._id, idx)
                   }"
                   @click="selectLesson(material, idx)">
                
                <div class="lesson-status">
                  <span v-if="isLessonCompleted(selectedCourse._id, idx)" class="status-check">
                    <i class="fas fa-check"></i>
                  </span>
                  <span v-else class="status-number">{{ idx + 1 }}</span>
                </div>
                
                <div class="lesson-sidebar-info">
                  <span class="lesson-sidebar-title">{{ material.title }}</span>
                  <span class="lesson-sidebar-type">
                    <i :class="getMaterialIcon(material.type)"></i>
                    {{ getLessonTypeName(material.type) }}
                  </span>
                </div>
              </div>
            </div>
          </aside>
          
          <!-- Main Player Area -->
          <div class="player-main">
            <div v-if="currentLesson" class="lesson-player">
              <!-- Lesson Title -->
              <div class="lesson-header">
                <h3>Aula {{ currentLessonIndex + 1 }}: {{ currentLesson.title }}</h3>
                <span class="lesson-type-badge-player">
                  <i :class="getMaterialIcon(currentLesson.type)"></i>
                  {{ getLessonTypeName(currentLesson.type) }}
                </span>
              </div>
              
              <!-- Content Player -->
              <div class="content-player">
                <video v-if="currentLesson.type === 'video'" 
                       :src="currentLesson.url" 
                       controls 
                       class="video-player"></video>
                
                <img v-else-if="currentLesson.type === 'image'" 
                     :src="currentLesson.url" 
                     :alt="currentLesson.title"
                     class="image-player" />
                
                <iframe v-else-if="currentLesson.type === 'pdf'" 
                        :src="currentLesson.url"
                        class="pdf-player"></iframe>
              </div>
              
              <!-- Lesson Actions -->
              <div class="lesson-actions">
                <button v-if="currentLessonIndex > 0" class="btn-nav prev" @click="prevLesson">
                  <i class="fas fa-chevron-left"></i> Anterior
                </button>
                
                <button v-if="!isLessonCompleted(selectedCourse._id, currentLessonIndex)"
                        class="btn-complete-lesson"
                        @click="markCurrentAsCompleted">
                  <i class="fas fa-check"></i> Marcar como Concluída
                </button>
                
                <span v-else class="completed-badge">
                  <i class="fas fa-check-circle"></i> Concluída
                </span>
                
                <button v-if="currentLessonIndex < selectedCourse.courseId.materials.length - 1" 
                        class="btn-nav next"
                        @click="nextLesson">
                  Próxima <i class="fas fa-chevron-right"></i>
                </button>
                
                <a :href="currentLesson.url" target="_blank" download class="btn-download-lesson">
                  <i class="fas fa-download"></i>
                </a>
              </div>
            </div>
            
            <!-- No Lesson Selected -->
            <div v-else class="no-lesson-selected">
              <i class="fas fa-play-circle"></i>
              <h3>Selecione uma aula</h3>
              <p>Clique em qualquer aula na lista ao lado</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { notify } from '../utils/swal'
import API_URL from '../config/api'

const auth = useAuthStore()
const enrollments = ref([])
const selectedCourse = ref(null)
const currentLesson = ref(null)
const currentLessonIndex = ref(0)

// Computed
const approvedCourses = computed(() => enrollments.value.filter(e => e.status === 'approved'))
const pendingCourses = computed(() => enrollments.value.filter(e => e.status === 'pending'))

// Completed Lessons
const getCompletedLessons = () => {
    const saved = localStorage.getItem('completedLessons')
    return saved ? JSON.parse(saved) : {}
}
const completedLessons = ref(getCompletedLessons())

const totalLessonsCompleted = computed(() => 
    Object.keys(completedLessons.value).filter(k => completedLessons.value[k]).length
)

const isLessonCompleted = (enrollmentId, lessonIdx) => {
    return completedLessons.value[`${enrollmentId}_${lessonIdx}`] === true
}

const getProgress = (enrollment) => {
    if (!enrollment.courseId.materials?.length) return 0
    const total = enrollment.courseId.materials.length
    let completed = 0
    for (let i = 0; i < total; i++) {
        if (isLessonCompleted(enrollment._id, i)) completed++
    }
    return Math.round((completed / total) * 100)
}

const getCompletedCount = (enrollment) => {
    if (!enrollment.courseId.materials?.length) return 0
    const total = enrollment.courseId.materials.length
    let completed = 0
    for (let i = 0; i < total; i++) {
        if (isLessonCompleted(enrollment._id, i)) completed++
    }
    return completed
}

const getLessonTypeName = (type) => {
    const types = { video: 'Vídeo', pdf: 'PDF', image: 'Imagem' }
    return types[type] || 'Arquivo'
}

const getMaterialIcon = (type) => {
    const icons = { video: 'fas fa-play-circle', pdf: 'fas fa-file-pdf', image: 'fas fa-image' }
    return icons[type] || 'fas fa-file'
}

const selectCourse = (enrollment) => {
    selectedCourse.value = enrollment
    currentLesson.value = null
    currentLessonIndex.value = 0
    
    const materials = enrollment.courseId.materials
    if (materials?.length) {
        for (let i = 0; i < materials.length; i++) {
            if (!isLessonCompleted(enrollment._id, i)) {
                selectLesson(materials[i], i)
                return
            }
        }
        selectLesson(materials[0], 0)
    }
}

const selectLesson = (material, idx) => {
    currentLesson.value = material
    currentLessonIndex.value = idx
}

const prevLesson = () => {
    if (currentLessonIndex.value > 0) {
        currentLessonIndex.value--
        currentLesson.value = selectedCourse.value.courseId.materials[currentLessonIndex.value]
    }
}

const nextLesson = () => {
    const materials = selectedCourse.value.courseId.materials
    if (currentLessonIndex.value < materials.length - 1) {
        currentLessonIndex.value++
        currentLesson.value = materials[currentLessonIndex.value]
    }
}

const markCurrentAsCompleted = () => {
    if (selectedCourse.value && currentLessonIndex.value !== null) {
        const key = `${selectedCourse.value._id}_${currentLessonIndex.value}`
        completedLessons.value[key] = true
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons.value))
        notify.success('Aula Concluída!', 'Seu progresso foi salvo.')
        nextLesson()
    }
}

const fetchEnrollments = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/courses/my-courses`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        enrollments.value = res.data
    } catch (err) {
        console.error(err)
    }
}

onMounted(fetchEnrollments)
</script>

<style scoped>
/* Academy Dashboard Layout */
.academy-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Sidebar */
.dashboard-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  padding: 2rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  text-align: center;
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent), #c0392b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 auto 1rem;
}

.sidebar-header h3 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.user-email {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.sidebar-nav {
  padding: 1.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent);
  border-left-color: var(--accent);
}

.nav-item.explore {
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--accent), #c0392b);
  color: white;
  margin: 1rem 1rem 0;
  border-radius: 8px;
  border: none;
}

.nav-badge {
  margin-left: auto;
  background: var(--accent);
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
}

.sidebar-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Main Content */
.dashboard-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.main-header h1 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.main-header p {
  color: var(--text-secondary);
}

.btn-explore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-explore:hover {
  transform: scale(1.05);
}

/* Courses Grid */
.continue-section h2, .pending-section h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.continue-section h2 i, .pending-section h2 i {
  color: var(--accent);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  border-color: var(--accent);
}

.course-thumbnail {
  height: 160px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(231,76,60,0.3), rgba(102,126,234,0.3));
}

.thumbnail-overlay {
  position: relative;
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  transition: all 0.3s;
}

.course-card:hover .thumbnail-overlay {
  background: var(--accent);
  transform: scale(1.1);
}

.course-progress-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.progress-ring {
  width: 50px;
  height: 50px;
  position: relative;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: rgba(255,255,255,0.2);
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.course-details {
  padding: 1.5rem;
}

.course-category {
  font-size: 0.75rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.course-title {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.course-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.course-meta i {
  margin-right: 0.3rem;
}

.course-progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #c0392b);
  border-radius: 2px;
  transition: width 0.5s;
}

.btn-continue {
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-continue:hover {
  background: var(--accent);
  color: white;
}

/* Course Player */
.course-player-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.btn-back:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.player-header {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

.player-category {
  font-size: 0.75rem;
  color: var(--accent);
  text-transform: uppercase;
}

.player-header h2 {
  color: var(--text-primary);
  margin: 0.5rem 0;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.progress-bar-player {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.player-progress span {
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 600;
}

.course-content-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
}

/* Lessons Sidebar */
.lessons-sidebar {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.sidebar-title {
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.lessons-list-sidebar {
  max-height: 500px;
  overflow-y: auto;
}

.lesson-sidebar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.lesson-sidebar-item:hover {
  background: rgba(255,255,255,0.03);
}

.lesson-sidebar-item.active {
  background: rgba(var(--accent-rgb), 0.1);
  border-left-color: var(--accent);
}

.lesson-sidebar-item.completed .lesson-status {
  background: #2ecc71;
}

.lesson-status {
  width: 32px;
  height: 32px;
  background: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.status-check {
  color: white;
}

.lesson-sidebar-info {
  flex: 1;
  min-width: 0;
}

.lesson-sidebar-title {
  display: block;
  color: var(--text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-sidebar-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.lesson-sidebar-type i {
  margin-right: 0.3rem;
}

/* Player Main */
.player-main {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.lesson-player {
  display: flex;
  flex-direction: column;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--border);
}

.lesson-header h3 {
  color: var(--text-primary);
}

.lesson-type-badge-player {
  background: rgba(231,76,60,0.2);
  color: var(--accent);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.content-player {
  background: #000;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player, .image-player {
  max-width: 100%;
  max-height: 500px;
}

.pdf-player {
  width: 100%;
  height: 500px;
  border: none;
}

.lesson-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  flex-wrap: wrap;
}

.btn-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-nav:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-complete-lesson {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #2ecc71;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-complete-lesson:hover {
  background: #27ae60;
  transform: scale(1.05);
}

.completed-badge {
  color: #2ecc71;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-download-lesson {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-download-lesson:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.no-lesson-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  color: var(--text-secondary);
  text-align: center;
}

.no-lesson-selected i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

/* Pending Section */
.pending-section {
  margin-top: 3rem;
}

.pending-courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pending-course-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid rgba(243, 156, 18, 0.3);
  border-radius: 12px;
}

.pending-icon {
  width: 50px;
  height: 50px;
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.pending-info h4 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.pending-status {
  color: #f39c12;
  font-size: 0.85rem;
}

/* Empty State */
.empty-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.empty-content {
  text-align: center;
}

.empty-content i {
  font-size: 5rem;
  color: var(--accent);
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.empty-content h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--accent);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .course-content-layout {
    grid-template-columns: 1fr;
  }
  
  .lessons-sidebar {
    order: 2;
  }
}

@media (max-width: 768px) {
  .academy-dashboard {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 1rem;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 1rem;
  }
  
  .user-avatar-large {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    margin: 0 1rem 0 0;
  }
  
  .sidebar-nav {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    overflow-x: auto;
  }
  
  .nav-item {
    padding: 0.8rem 1rem;
    border-radius: 8px;
    border: none;
    white-space: nowrap;
  }
  
  .sidebar-stats {
    display: none;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .main-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
