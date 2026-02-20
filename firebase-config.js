// Configuração do Firebase
// IMPORTANTE: Substitua com suas credenciais do Firebase após criar o projeto

// Configuração do app Firebase (compat)
const firebaseConfig = {
  apiKey: "AIzaSyAU9eZSFPkKJBFIHJFThRI9CsZB2eE28pg",
  authDomain: "estudio-tatuagem-d9071.firebaseapp.com",
  projectId: "estudio-tatuagem-d9071",
  storageBucket: "estudio-tatuagem-d9071.firebasestorage.app",
  messagingSenderId: "849805478057",
  appId: "1:849805478057:web:3598c5e219dc4b1f1201b8"
};

// Inicializar Firebase
let db;
let auth;

function initFirebase() {
    try {
        // Verifica se o Firebase já foi inicializado
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.firestore();
        auth = firebase.auth();
        
        console.log('✅ Firebase inicializado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase:', error);
        console.log('⚠️ Usando armazenamento local como fallback');
        return false;
    }
}

// Salvar formulário no Firestore
async function saveToFirestore(formName, data) {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        const docRef = await db.collection('formularios').add({
            ...data,
            formType: formName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: new Date().toISOString(),
            status: 'novo' // novo, visualizado, arquivado
        });

        console.log('✅ Formulário salvo no Firestore com ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Erro ao salvar no Firestore:', error);
        return { success: false, error: error.message };
    }
}

// Carregar formulários do Firestore
async function loadFromFirestore(filters = {}) {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        let query = db.collection('formularios');

        // Aplicar filtros
        if (filters.formType) {
            query = query.where('formType', '==', filters.formType);
        }

        if (filters.startDate) {
            query = query.where('createdAt', '>=', filters.startDate);
        }

        if (filters.endDate) {
            query = query.where('createdAt', '<=', filters.endDate);
        }

        // Ordenar por data mais recente
        query = query.orderBy('createdAt', 'desc');

        // Limitar resultados
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const snapshot = await query.get();
        const formularios = [];

        snapshot.forEach(doc => {
            formularios.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ ${formularios.length} formulários carregados do Firestore`);
        return formularios;
    } catch (error) {
        console.error('❌ Erro ao carregar do Firestore:', error);
        return [];
    }
}

// Atualizar status do formulário
async function updateFormStatus(formId, newStatus) {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        await db.collection('formularios').doc(formId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Status atualizado:', formId, '->', newStatus);
        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao atualizar status:', error);
        return { success: false, error: error.message };
    }
}

// Excluir formulário
async function deleteFromFirestore(formId) {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        await db.collection('formularios').doc(formId).delete();
        console.log('✅ Formulário excluído:', formId);
        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao excluir:', error);
        return { success: false, error: error.message };
    }
}

// Autenticação simples (para área administrativa)
async function loginAdmin(email, password) {
    try {
        if (!auth) {
            throw new Error('Firebase Auth não inicializado');
        }

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Login realizado:', userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return { success: false, error: error.message };
    }
}

async function logoutAdmin() {
    try {
        if (!auth) {
            throw new Error('Firebase Auth não inicializado');
        }

        await auth.signOut();
        console.log('✅ Logout realizado');
        return { success: true };
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        return { success: false, error: error.message };
    }
}

// Verificar se usuário está logado
function onAuthStateChanged(callback) {
    if (!auth) {
        callback(null);
        return;
    }

    auth.onAuthStateChanged(callback);
}

// Buscar formulários por CPF ou nome
async function searchFormularios(searchTerm) {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        const snapshot = await db.collection('formularios')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const formularios = [];
        const term = searchTerm.toLowerCase();

        snapshot.forEach(doc => {
            const data = doc.data();
            const nome = (data.nome || '').toLowerCase();
            const cpf = (data.cpf || '').replace(/\D/g, '');
            const searchCpf = term.replace(/\D/g, '');

            if (nome.includes(term) || cpf.includes(searchCpf)) {
                formularios.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        return formularios;
    } catch (error) {
        console.error('❌ Erro na busca:', error);
        return [];
    }
}

// Estatísticas
async function getStatistics() {
    try {
        if (!db) {
            throw new Error('Firebase não inicializado');
        }

        const snapshot = await db.collection('formularios').get();
        
        const stats = {
            total: 0,
            agendamento: 0,
            anamnese: 0,
            consentimento: 0,
            'uso-imagem': 0,
            hoje: 0,
            semana: 0,
            mes: 0
        };

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const semanaAtras = new Date(hoje);
        semanaAtras.setDate(semanaAtras.getDate() - 7);
        
        const mesAtras = new Date(hoje);
        mesAtras.setMonth(mesAtras.getMonth() - 1);

        snapshot.forEach(doc => {
            const data = doc.data();
            stats.total++;

            if (data.formType) {
                stats[data.formType] = (stats[data.formType] || 0) + 1;
            }

            if (data.createdAt) {
                const dataForm = new Date(data.createdAt);
                if (dataForm >= hoje) stats.hoje++;
                if (dataForm >= semanaAtras) stats.semana++;
                if (dataForm >= mesAtras) stats.mes++;
            }
        });

        return stats;
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error);
        return null;
    }
}
