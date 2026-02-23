/**
 * Sistema de Formulários para Estúdio de Tatuagem
 * Desenvolvido por: Samtech Informática (CNPJ 55.004.442/0001-06)
 * Responsável Técnico: Samuel Lacerda
 * Cliente: Opedroquetatua
 * Copyright (c) 2026 Samtech Informática - Todos os direitos reservados
 * 
 * Este software e seu código-fonte são propriedade protegida.
 * Uso não autorizado, cópia, modificação ou distribuição são estritamente proibidos.
 */

// Navegação entre páginas
function openForm(formType) {
    switch(formType) {
        case 'agendamento':
            window.location.href = 'agendamento.html';
            break;
        case 'anamnese':
            window.location.href = 'anamnese.html';
            break;
        case 'consentimento':
            window.location.href = 'consentimento.html';
            break;
        case 'imagem':
            window.location.href = 'uso-imagem.html';
            break;
    }
}

function goBack() {
    window.location.href = 'index.html';
}

// Validação de formulários
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    return isValid;
}

// Formatação de CPF
function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

// Formatação de Telefone
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = value;
}

// Formatação de Data
function formatDate(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    input.value = value;
}

// Salvar dados (Firebase + localStorage como backup)
async function saveFormData(formName, data) {
    const timestamp = new Date().toISOString();
    const formData = {
        ...data,
        timestamp,
        formType: formName
    };
    
    // Tentar salvar no Firebase primeiro
    let firebaseSaved = false;
    if (typeof saveToFirestore === 'function') {
        try {
            const result = await saveToFirestore(formName, formData);
            if (result.success) {
                firebaseSaved = true;
                formData.firebaseId = result.id;
                console.log('✅ Salvo no Firebase:', result.id);
            }
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar no Firebase:', error);
        }
    }
    
    // Sempre salvar no localStorage como backup
    const savedForms = JSON.parse(localStorage.getItem('studioForms') || '[]');
    savedForms.push(formData);
    localStorage.setItem('studioForms', JSON.stringify(savedForms));
    console.log('✅ Salvo no localStorage');
    
    return formData;
}

// Classe para Assinatura Digital
class SignaturePad {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupCanvas();
        this.addEventListeners();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasSignature = false;
    }
    
    isEmpty() {
        return !this.hasSignature;
    }
    
    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Exibir mensagem de sucesso
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>Sucesso!</strong> ${message}
    `;
    
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(alertDiv, formContainer.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Exibir mensagem de erro
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <strong>Erro!</strong> ${message}
    `;
    
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(alertDiv, formContainer.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Imprimir formulário
function printForm() {
    window.print();
}

// Gerar ID único para cada formulário
function generateFormId() {
    return 'FORM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Calcular idade
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Verificar se é maior de idade
function isAdult(birthDate) {
    return calculateAge(birthDate) >= 18;
}

const PROFILE_STORAGE_KEY = 'studioProfile';
const COMMON_PROFILE_FIELDS = [
    'nome',
    'cpf',
    'rg',
    'email',
    'telefone',
    'dataNascimento',
    'endereco'
];

function loadProfile() {
    try {
        return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
    } catch (error) {
        return {};
    }
}

function saveProfile(profile) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function updateProfileFromField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) {
        return;
    }

    const profile = loadProfile();
    profile[fieldId] = field.value.trim();

    if (fieldId === 'dataNascimento') {
        const ageField = document.getElementById('idade');
        if (ageField && field.value) {
            const age = calculateAge(field.value);
            ageField.value = age;
            profile.idade = age;
        }
    }

    saveProfile(profile);
}

function applyProfileToField(fieldId, profile) {
    const field = document.getElementById(fieldId);
    if (!field || !profile[fieldId] || field.value.trim()) {
        return;
    }

    field.value = profile[fieldId];

    if (fieldId === 'cpf') {
        formatCPF(field);
    }

    if (fieldId === 'telefone') {
        formatPhone(field);
    }

    if (fieldId === 'dataNascimento') {
        const ageField = document.getElementById('idade');
        if (ageField && field.value) {
            ageField.value = calculateAge(field.value);
        }
    }
}

function syncProfileToForm() {
    const profile = loadProfile();
    COMMON_PROFILE_FIELDS.forEach((fieldId) => applyProfileToField(fieldId, profile));
}

function bindProfileSync() {
    COMMON_PROFILE_FIELDS.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) {
            return;
        }

        const eventName = fieldId === 'dataNascimento' ? 'change' : 'input';
        field.addEventListener(eventName, () => updateProfileFromField(fieldId));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncProfileToForm();
    bindProfileSync();
});
