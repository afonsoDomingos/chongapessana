<template>
  <div class="admin-page">
    <h1 class="cinematic-font">Admin Panel</h1>
    
    <section class="admin-tabs">
        <button @click="activeTab = 'enrollments'" :class="{ active: activeTab === 'enrollments' }">
          <i class="fas fa-users"></i> Inscrições
        </button>
        <button @click="activeTab = 'billing'; calculateBilling()" :class="{ active: activeTab === 'billing' }">
          <i class="fas fa-chart-line"></i> Faturação
        </button>
        <button @click="activeTab = 'manage-courses'; fetchCourses()" :class="{ active: activeTab === 'manage-courses' }">
          <i class="fas fa-book"></i> Gerir Cursos
        </button>
        <button @click="activeTab = 'courses'" :class="{ active: activeTab === 'courses' }">
          <i class="fas fa-plus"></i> Criar Curso
        </button>
    </section>

    <!-- Enrollments Tab -->
    <div v-if="activeTab === 'enrollments'" class="enrollments-admin">
      <h2>Validar Pagamentos</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Curso</th>
            <th>Comprovativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="enr in enrollments" :key="enr._id">
            <td>{{ enr.userId?.name }} ({{ enr.userId?.email }})</td>
            <td>{{ enr.courseId?.title?.pt }}</td>
            <td>
              <a v-if="enr.proofUrl" :href="enr.proofUrl" target="_blank" class="link-gold">Ver Doc</a>
              <span v-else>N/A</span>
            </td>
            <td>
              <div v-if="enr.status === 'pending'" class="actions">
                <button @click="updateStatus(enr._id, 'approved')" class="btn-success">Aprovar</button>
                <button @click="updateStatus(enr._id, 'rejected')" class="btn-danger">Rejeitar</button>
              </div>
              <span v-else :class="enr.status">{{ enr.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Billing Tab -->
    <div v-if="activeTab === 'billing'" class="billing-admin">
      <h2><i class="fas fa-chart-line"></i> Faturação & Pagamentos</h2>
      
      <!-- Stats Cards -->
      <div class="billing-stats">
        <div class="stat-card total">
          <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ billingStats.totalRevenue.toLocaleString() }} MT</span>
            <span class="stat-label">Receita Total</span>
          </div>
        </div>
        <div class="stat-card approved">
          <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ billingStats.approvedCount }}</span>
            <span class="stat-label">Pagamentos Aprovados</span>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="stat-icon"><i class="fas fa-clock"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ billingStats.pendingCount }}</span>
            <span class="stat-label">Pagamentos Pendentes</span>
          </div>
        </div>
        <div class="stat-card pending-value">
          <div class="stat-icon"><i class="fas fa-hourglass-half"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ billingStats.pendingRevenue.toLocaleString() }} MT</span>
            <span class="stat-label">Valor Pendente</span>
          </div>
        </div>
      </div>

      <!-- Course Revenue Breakdown -->
      <div class="billing-section">
        <h3><i class="fas fa-book"></i> Receita por Curso</h3>
        <div class="course-revenue-list">
          <div class="course-revenue-item" v-for="course in billingStats.courseBreakdown" :key="course.name">
            <div class="course-info">
              <span class="course-name">{{ course.name }}</span>
              <span class="course-price">{{ course.price }} MT/unidade</span>
            </div>
            <div class="course-stats">
              <span class="enrollments">{{ course.count }} inscrições</span>
              <span class="revenue">{{ course.total.toLocaleString() }} MT</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment History -->
      <div class="billing-section">
        <h3><i class="fas fa-history"></i> Histórico de Pagamentos</h3>
        <table class="admin-table billing-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Aluno</th>
              <th>Curso</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in paymentHistory" :key="payment._id" :class="payment.status">
              <td>{{ formatDate(payment.createdAt) }}</td>
              <td>{{ payment.userId?.name || 'N/A' }}</td>
              <td>{{ payment.courseId?.title?.pt || 'N/A' }}</td>
              <td class="amount">{{ payment.courseId?.price || 0 }} MT</td>
              <td>
                <span :class="'status-badge ' + payment.status">
                  {{ payment.status === 'approved' ? '✓ Aprovado' : payment.status === 'pending' ? '⏳ Pendente' : '✗ Rejeitado' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Manage Courses Tab -->
    <div v-if="activeTab === 'manage-courses'" class="courses-admin">
      <h2><i class="fas fa-cog"></i> Gerir Cursos</h2>
      <div class="courses-list">
        <div v-for="course in courses" :key="course._id" class="course-item-full">
          <div class="course-header">
            <div class="course-info-admin">
              <h4>{{ course.title?.pt }}</h4>
              <p>{{ course.price }} {{ course.currency || 'MT' }}</p>
              <span :class="['status-tag', course.status]">{{ course.status }}</span>
            </div>
            <div class="course-actions">
              <button @click="toggleMaterials(course._id)" class="btn-materials">
                <i class="fas fa-folder-open"></i> Materiais ({{ course.materials?.length || 0 }})
              </button>
              <button @click="deleteCourse(course._id)" class="btn-delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <!-- Materials Section (expandable) -->
          <div v-if="expandedCourse === course._id" class="materials-section">
            <h5><i class="fas fa-file-alt"></i> Materiais do Curso</h5>
            
            <!-- Add Material Form -->
            <div class="add-material-form">
              <input v-model="newMaterial.title" placeholder="Título do material" />
              <select v-model="newMaterial.type">
                <option value="video">📹 Vídeo</option>
                <option value="pdf">📄 PDF</option>
                <option value="image">🖼️ Imagem</option>
              </select>
              
              <!-- Upload Mode Toggle -->
              <div class="upload-mode-toggle">
                <button type="button" 
                  :class="{ active: uploadMode === 'url' }" 
                  @click="uploadMode = 'url'">
                  <i class="fas fa-link"></i> URL
                </button>
                <button type="button" 
                  :class="{ active: uploadMode === 'file' }" 
                  @click="uploadMode = 'file'">
                  <i class="fas fa-upload"></i> Arquivo
                </button>
              </div>
              
              <!-- URL Input -->
              <input 
                v-if="uploadMode === 'url'" 
                v-model="newMaterial.url" 
                placeholder="URL do material" 
              />
              
              <!-- File Upload -->
              <div v-if="uploadMode === 'file'" class="file-upload-wrapper">
                <input 
                  type="file" 
                  ref="materialFileInput"
                  @change="handleMaterialFile"
                  accept=".pdf,.jpg,.jpeg,.png,.mp4,.webm"
                />
                <span v-if="materialFile" class="file-name">
                  <i class="fas fa-file"></i> {{ materialFile.name }}
                </span>
              </div>
              
              <button 
                @click="addMaterial(course._id)" 
                class="btn-add-material"
                :disabled="uploadingMaterial"
              >
                <i :class="uploadingMaterial ? 'fas fa-spinner fa-spin' : 'fas fa-plus'"></i>
                {{ uploadingMaterial ? 'A enviar...' : 'Adicionar' }}
              </button>
            </div>
            
            <!-- Materials List -->
            <div class="materials-list-admin">
              <div v-for="material in course.materials" :key="material._id" class="material-item-admin">
                <!-- Preview Thumbnail -->
                <div class="material-preview" @click="openPreview(material)">
                  <!-- Image Preview -->
                  <img 
                    v-if="material.type === 'image'" 
                    :src="material.url" 
                    :alt="material.title"
                    class="preview-thumb"
                  />
                  <!-- Video Preview -->
                  <div v-else-if="material.type === 'video'" class="preview-video-thumb">
                    <i class="fas fa-play-circle"></i>
                  </div>
                  <!-- PDF Preview -->
                  <div v-else-if="material.type === 'pdf'" class="preview-pdf-thumb">
                    <i class="fas fa-file-pdf"></i>
                  </div>
                  <!-- Default -->
                  <div v-else class="preview-default-thumb">
                    <i class="fas fa-file"></i>
                  </div>
                  <span class="preview-overlay"><i class="fas fa-eye"></i></span>
                </div>
                
                <!-- Material Info -->
                <div class="material-info">
                  <span class="material-title">{{ material.title }}</span>
                  <span class="material-type-badge">{{ material.type }}</span>
                </div>
                
                <!-- Actions -->
                <div class="material-actions">
                  <a :href="material.url" target="_blank" class="btn-view-material" title="Ver">
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                  <button @click="deleteMaterial(course._id, material._id)" class="btn-remove-material" title="Remover">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <p v-if="!course.materials?.length" class="no-materials">Nenhum material adicionado</p>
            </div>
          </div>
        </div>
        
        <!-- Preview Modal -->
        <div v-if="previewMaterial" class="preview-modal" @click.self="closePreview">
          <div class="preview-modal-content">
            <button class="preview-close" @click="closePreview"><i class="fas fa-times"></i></button>
            <h4>{{ previewMaterial.title }}</h4>
            
            <!-- Image Preview -->
            <img 
              v-if="previewMaterial.type === 'image'" 
              :src="previewMaterial.url" 
              :alt="previewMaterial.title"
              class="preview-full-image"
            />
            
            <!-- Video Preview -->
            <video 
              v-else-if="previewMaterial.type === 'video'" 
              :src="previewMaterial.url" 
              controls
              class="preview-full-video"
            ></video>
            
            <!-- PDF Preview -->
            <iframe 
              v-else-if="previewMaterial.type === 'pdf'" 
              :src="previewMaterial.url"
              class="preview-full-pdf"
            ></iframe>
            
            <!-- Download Button -->
            <a :href="previewMaterial.url" target="_blank" download class="btn-download">
              <i class="fas fa-download"></i> Baixar Arquivo
            </a>
          </div>
        </div>
        <div v-if="!courses.length" class="empty-msg">
          <i class="fas fa-inbox"></i>
          <p>Nenhum curso encontrado</p>
        </div>
      </div>
    </div>

    <!-- Create Course Tab -->
    <div v-if="activeTab === 'courses'" class="course-form-container">
        <h2>Criar Novo Curso</h2>
        <form @submit.prevent="handleCreateCourse" class="course-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Título (PT)</label>
                    <input v-model="newCourse.title.pt" required />
                </div>
                <div class="form-group">
                    <label>Título (EN)</label>
                    <input v-model="newCourse.title.en" required />
                </div>
            </div>
            <div class="form-group">
                    <label>Preço (MT)</label>
                    <input type="number" v-model="newCourse.price" required />
            </div>
            <button type="submit" class="btn-primary">Criar Curso</button>
        </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { notify } from '../utils/swal'
import Swal from 'sweetalert2'
import API_URL from '../config/api'

const auth = useAuthStore()
const enrollments = ref([])
const courses = ref([])
const activeTab = ref('enrollments')
const expandedCourse = ref(null)
const paymentHistory = ref([])

const billingStats = ref({
    totalRevenue: 0,
    pendingRevenue: 0,
    approvedCount: 0,
    pendingCount: 0,
    courseBreakdown: []
})

const previewMaterial = ref(null)

const openPreview = (material) => {
    previewMaterial.value = material
}

const closePreview = () => {
    previewMaterial.value = null
}

const newCourse = ref({
    title: { pt: '', en: '' },
    description: { pt: 'Descrição padrão', en: 'Default description' },
    price: 0,
    status: 'announced'
})

const newMaterial = ref({
    title: '',
    type: 'video',
    url: ''
})

const uploadMode = ref('url')
const materialFile = ref(null)
const materialFileInput = ref(null)
const uploadingMaterial = ref(false)

const handleMaterialFile = (e) => {
    materialFile.value = e.target.files[0]
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const calculateBilling = () => {
    const courseMap = {}
    let totalRevenue = 0
    let pendingRevenue = 0
    let approvedCount = 0
    let pendingCount = 0

    enrollments.value.forEach(enr => {
        const courseName = enr.courseId?.title?.pt || 'Desconhecido'
        const price = enr.courseId?.price || 0

        if (enr.status === 'approved') {
            totalRevenue += price
            approvedCount++
            
            if (!courseMap[courseName]) {
                courseMap[courseName] = { name: courseName, price, count: 0, total: 0 }
            }
            courseMap[courseName].count++
            courseMap[courseName].total += price
        } else if (enr.status === 'pending') {
            pendingRevenue += price
            pendingCount++
        }
    })

    billingStats.value = {
        totalRevenue,
        pendingRevenue,
        approvedCount,
        pendingCount,
        courseBreakdown: Object.values(courseMap)
    }

    paymentHistory.value = [...enrollments.value].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    )
}

const toggleMaterials = (courseId) => {
    expandedCourse.value = expandedCourse.value === courseId ? null : courseId
}

const getMaterialIcon = (type) => {
    switch(type) {
        case 'video': return 'fas fa-play-circle'
        case 'pdf': return 'fas fa-file-pdf'
        case 'image': return 'fas fa-image'
        default: return 'fas fa-file'
    }
}

const addMaterial = async (courseId) => {
    // Validate title
    if (!newMaterial.value.title) {
        notify.error('Erro', 'Preencha o título do material')
        return
    }
    
    // Validate URL or File
    if (uploadMode.value === 'url' && !newMaterial.value.url) {
        notify.error('Erro', 'Preencha a URL do material')
        return
    }
    if (uploadMode.value === 'file' && !materialFile.value) {
        notify.error('Erro', 'Selecione um arquivo')
        return
    }

    uploadingMaterial.value = true
    
    try {
        let url = newMaterial.value.url
        
        // If file mode, upload file first
        if (uploadMode.value === 'file' && materialFile.value) {
            const formData = new FormData()
            formData.append('file', materialFile.value)
            
            const uploadRes = await axios.post(`${API_URL}/api/admin/upload-material`, formData, {
                headers: { 
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            url = uploadRes.data.url
        }
        
        // Add material with URL
        await axios.post(`${API_URL}/api/admin/courses/${courseId}/materials`, {
            title: newMaterial.value.title,
            type: newMaterial.value.type,
            url: url
        }, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        
        notify.success('Sucesso!', 'Material adicionado.')
        newMaterial.value = { title: '', type: 'video', url: '' }
        materialFile.value = null
        if (materialFileInput.value) materialFileInput.value.value = ''
        fetchCourses()
    } catch (err) {
        notify.error('Erro', err.response?.data?.message || 'Erro ao adicionar material')
    } finally {
        uploadingMaterial.value = false
    }
}

const deleteMaterial = async (courseId, materialId) => {
    try {
        await axios.delete(`${API_URL}/api/admin/courses/${courseId}/materials/${materialId}`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        notify.success('Removido!', 'Material removido.')
        fetchCourses()
    } catch (err) {
        notify.error('Erro', 'Erro ao remover material')
    }
}

const fetchAllEnrollments = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/admin/enrollments`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        enrollments.value = res.data
    } catch (err) {
        console.error(err)
    }
}

const fetchCourses = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/courses`)
        courses.value = res.data
    } catch (err) {
        console.error(err)
    }
}

const deleteCourse = async (id) => {
    const result = await Swal.fire({
        title: 'Eliminar Curso?',
        text: 'Esta ação não pode ser revertida. Todas as inscrições serão também eliminadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, eliminar!',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#fff'
    })
    
    if (result.isConfirmed) {
        try {
            await axios.delete(`${API_URL}/api/admin/courses/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            })
            notify.success('Eliminado!', 'Curso eliminado com sucesso.')
            fetchCourses()
        } catch (err) {
            notify.error('Erro', 'Erro ao eliminar curso')
        }
    }
}

const updateStatus = async (id, status) => {
    try {
        await axios.patch(`${API_URL}/api/admin/enrollments/${id}`, { status }, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        fetchAllEnrollments()
    } catch (err) {
        notify.error('Erro', 'Erro ao atualizar status')
    }
}

const handleCreateCourse = async () => {
    try {
        await axios.post(`${API_URL}/api/admin/courses`, newCourse.value, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        notify.success('Sucesso!', 'Curso criado com sucesso.')
        activeTab.value = 'manage-courses'
        fetchCourses()
    } catch (err) {
        notify.error('Erro', 'Erro ao criar curso')
    }
}

onMounted(fetchAllEnrollments)
</script>

<style scoped>
.admin-page { padding: 3rem 2rem; }
.admin-tabs { margin-bottom: 2rem; display: flex; gap: 1rem; }
.admin-tabs button { padding: 0.8rem 1.5rem; background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer; }
.admin-tabs button.active { background: var(--accent); color: #000; border-color: var(--accent); }

.admin-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.admin-table th, .admin-table td { padding: 1rem; border: 1px solid var(--border); text-align: left; }
.admin-table th { background: var(--bg-secondary); }

.actions { display: flex; gap: 0.5rem; }
.btn-success { background: var(--success); color: white; border: none; padding: 0.5rem; cursor: pointer; }
.btn-danger { background: var(--danger); color: white; border: none; padding: 0.5rem; cursor: pointer; }
.link-gold { color: var(--accent); font-weight: bold; }

.course-form { max-width: 600px; display: flex; flex-direction: column; gap: 1rem; }
.form-row { display: flex; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.form-group input { padding: 0.8rem; background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); }
.btn-primary { padding: 1rem; background: var(--accent); border: none; font-weight: bold; cursor: pointer; width: 100%; }

.approved { color: var(--success); font-weight: bold; }
.rejected { color: var(--danger); font-weight: bold; }

/* Course Management */
.courses-admin h2 i { margin-right: 0.5rem; }

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.3s;
}

.course-item:hover {
  border-color: var(--accent);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.course-info-admin h4 {
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}

.course-info-admin p {
  color: var(--accent);
  font-weight: 600;
}

.status-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-tag.active {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-tag.announced {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.btn-delete {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(231, 76, 60, 0.4);
}

.btn-delete i {
  margin-right: 0.5rem;
}

.empty-msg {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-msg i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.admin-tabs button i {
  margin-right: 0.5rem;
}

/* Course Item Full */
.course-item-full {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.course-item-full:hover {
  border-color: var(--accent);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-materials {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-materials:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* Materials Section */
.materials-section {
  padding: 1.5rem;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid var(--border);
}

.materials-section h5 {
  color: white;
  margin-bottom: 1rem;
}

.materials-section h5 i {
  margin-right: 0.5rem;
  color: #667eea;
}

.add-material-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.add-material-form input, .add-material-form select {
  padding: 0.6rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  flex: 1;
  min-width: 150px;
}

.btn-add-material {
  padding: 0.6rem 1rem;
  background: var(--success);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.materials-list-admin {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Upload Mode Toggle */
.upload-mode-toggle {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.upload-mode-toggle button {
  padding: 0.5rem 0.8rem;
  background: var(--bg-secondary);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.upload-mode-toggle button.active {
  background: var(--accent);
  color: white;
}

.upload-mode-toggle button i {
  margin-right: 0.3rem;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.file-upload-wrapper input[type="file"] {
  flex: 1;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}

.file-name {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.file-name i {
  margin-right: 0.3rem;
  color: var(--accent);
}

.btn-add-material:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.material-item-admin {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.material-item-admin i {
  color: #667eea;
}

.material-title {
  flex: 1;
  color: var(--text-primary);
}

.material-link {
  color: var(--accent);
  font-size: 0.85rem;
}

.btn-remove-material {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: none;
  padding: 0.4rem;
  border-radius: 4px;
  cursor: pointer;
}

.no-materials {
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

/* Material Preview Styles */
.material-preview {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

.material-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-video-thumb,
.preview-pdf-thumb,
.preview-default-thumb {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.preview-video-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.preview-pdf-thumb {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.preview-default-thumb {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.material-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.material-type-badge {
  font-size: 0.7rem;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  width: fit-content;
  text-transform: uppercase;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view-material {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-view-material:hover {
  background: #2ecc71;
  color: white;
}

/* Preview Modal */
.preview-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.preview-modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.preview-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.preview-modal-content h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
  padding-right: 2rem;
}

.preview-full-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
}

.preview-full-video {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
}

.preview-full-pdf {
  width: 100%;
  min-width: 600px;
  height: 70vh;
  border: none;
  border-radius: 8px;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}

.btn-download i {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .preview-full-pdf {
    min-width: 100%;
    height: 50vh;
  }
}

/* Billing Section */
.billing-admin h2 i { margin-right: 0.5rem; }

.billing-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.stat-card.total { border-left: 4px solid var(--accent); }
.stat-card.approved { border-left: 4px solid var(--success); }
.stat-card.pending { border-left: 4px solid #f39c12; }
.stat-card.pending-value { border-left: 4px solid #9b59b6; }

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-card.total .stat-icon { color: var(--accent); }
.stat-card.approved .stat-icon { color: var(--success); }
.stat-card.pending .stat-icon { color: #f39c12; }
.stat-card.pending-value .stat-icon { color: #9b59b6; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.billing-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.billing-section h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.billing-section h3 i {
  margin-right: 0.5rem;
  color: var(--accent);
}

.course-revenue-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.course-revenue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-name {
  font-weight: 600;
  color: var(--text-primary);
}

.course-price {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.course-stats {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.enrollments {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.revenue {
  font-weight: 700;
  color: var(--accent);
  font-size: 1.1rem;
}

.billing-table .amount {
  font-weight: 600;
  color: var(--accent);
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.approved {
  background: rgba(46, 204, 113, 0.15);
  color: var(--success);
}

.status-badge.pending {
  background: rgba(243, 156, 18, 0.15);
  color: #f39c12;
}

.status-badge.rejected {
  background: rgba(231, 76, 60, 0.15);
  color: var(--danger);
}

@media (max-width: 992px) {
  .billing-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .billing-stats {
    grid-template-columns: 1fr;
  }
  
  .course-revenue-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .course-stats {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
