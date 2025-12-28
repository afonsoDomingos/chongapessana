<template>
  <div class="admin-page">
    <h1 class="cinematic-font">Admin Panel</h1>
    
    <section class="admin-tabs">
        <button @click="activeTab = 'enrollments'" :class="{ active: activeTab === 'enrollments' }">
          <i class="fas fa-users"></i> Inscrições
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
              <input v-model="newMaterial.url" placeholder="URL do material" />
              <button @click="addMaterial(course._id)" class="btn-add-material">
                <i class="fas fa-plus"></i> Adicionar
              </button>
            </div>
            
            <!-- Materials List -->
            <div class="materials-list-admin">
              <div v-for="material in course.materials" :key="material._id" class="material-item-admin">
                <i :class="getMaterialIcon(material.type)"></i>
                <span class="material-title">{{ material.title }}</span>
                <a :href="material.url" target="_blank" class="material-link">Abrir</a>
                <button @click="deleteMaterial(course._id, material._id)" class="btn-remove-material">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <p v-if="!course.materials?.length" class="no-materials">Nenhum material adicionado</p>
            </div>
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
    if (!newMaterial.value.title || !newMaterial.value.url) {
        notify.error('Erro', 'Preencha todos os campos')
        return
    }
    try {
        await axios.post(`${API_URL}/api/admin/courses/${courseId}/materials`, newMaterial.value, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        notify.success('Sucesso!', 'Material adicionado.')
        newMaterial.value = { title: '', type: 'video', url: '' }
        fetchCourses()
    } catch (err) {
        notify.error('Erro', 'Erro ao adicionar material')
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
</style>
