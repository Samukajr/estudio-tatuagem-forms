/**
 * Opedroquetatua - Sistema de Formulários para Estúdio de Tatuagem
 * Copyright (c) 2026 Opedroquetatua
 * Todos os direitos reservados.
 * 
 * Este software e seu código-fonte são propriedade protegida.
 * Uso não autorizado, cópia, modificação ou distribuição são estritamente proibidos.
 */

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

        if (typeof firebase.firestore === 'function') {
            db = firebase.firestore();
        } else {
            db = null;
            console.warn('⚠️ Firestore não disponível neste contexto');
        }

        if (typeof firebase.auth === 'function') {
            auth = firebase.auth();
        } else {
            auth = null;
            console.warn('⚠️ Auth não disponível neste contexto');
        }

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
            console.warn('⚠️ Firebase DB não inicializado');
            throw new Error('Firebase não inicializado');
        }

        let query = db.collection('formularios');
        let hasFilters = false;

        // Aplicar filtros
        if (filters.formType) {
            query = query.where('formType', '==', filters.formType);
            hasFilters = true;
            console.log(`🔍 Filtro: formType = ${filters.formType}`);
        }

        if (filters.startDate) {
            query = query.where('createdAt', '>=', filters.startDate);
            hasFilters = true;
            console.log(`🔍 Filtro: startDate >= ${filters.startDate}`);
        }

        if (filters.endDate) {
            query = query.where('createdAt', '<=', filters.endDate);
            hasFilters = true;
            console.log(`🔍 Filtro: endDate <= ${filters.endDate}`);
        }

        // Ordenar por data mais recente (sem orderBy inicial para evitar índices)
        if (!hasFilters) {
            query = query.orderBy('timestamp', 'desc');
            console.log('📊 Carregando SEM filtros, ordenado por timestamp');
        }

        // Limitar resultados
        if (filters.limit) {
            query = query.limit(filters.limit);
            console.log(`🔢 Limitado a ${filters.limit} resultados`);
        }

        console.log('🔄 Executando query do Firestore...');
        const snapshot = await query.get();
        console.log(`📦 Query retornou ${snapshot.size} documentos`);
        
        const formularios = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Converter Firestore Timestamp para string ISO
            const formData = {
                id: doc.id,
                formId: doc.id,
                ...data
            };
            
            // Se timestamp é um objeto Firestore Timestamp, converte para ISO string
            if (formData.timestamp && typeof formData.timestamp === 'object' && formData.timestamp.seconds) {
                formData.timestamp = new Date(formData.timestamp.seconds * 1000).toISOString();
            }
            
            // Mesmo para createdAt se existir
            if (formData.createdAt && typeof formData.createdAt === 'object' && formData.createdAt.seconds) {
                formData.createdAt = new Date(formData.createdAt.seconds * 1000).toISOString();
            }
            
            formularios.push(formData);
            console.log(`✅ Documento carregado: ${doc.id}`, formData);
        });

        console.log(`✅ Total: ${formularios.length} formulários carregados do Firestore`);
        return formularios;
    } catch (error) {
        console.error('❌ Erro ao carregar do Firestore:', error.message);
        console.error('📋 Stack:', error);
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
