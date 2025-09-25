# Vue3-Toastify - Documentação de Uso

## Visão Geral

Este projeto utiliza o **vue3-toastify** para exibir notificações toast de forma elegante e user-friendly. O sistema está totalmente configurado e integrado ao projeto.

## Instalação e Configuração

### Pacote Instalado
```json
"vue3-toastify": "^0.2.8"
```

### Configuração Global (main.ts)
```typescript
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

app.use(Vue3Toastify, {
    autoClose: 3000,          // Auto-fecha em 3 segundos
    position: 'top-right',    // Posição no canto superior direito
    theme: 'auto',            // Tema automático (claro/escuro)
    hideProgressBar: false,   // Mostra barra de progresso
    closeOnClick: true,       // Fecha ao clicar
    pauseOnHover: true,       // Pausa ao passar o mouse
    draggable: true,          // Permite arrastar
} as ToastContainerOptions);
```

## Como Usar

### 1. Importação Direta
```typescript
import { toast } from 'vue3-toastify';

// Usar diretamente
toast.success('Sucesso!');
toast.error('Erro!');
toast.warning('Atenção!');
toast.info('Informação!');
```

### 2. Composable Personalizado (Recomendado)
```typescript
import { useToast } from '@/composables/useToast';

const { showSuccess, showError, showWarning, showInfo, showLoading } = useToast();

// Exemplos de uso
showSuccess('Operação realizada com sucesso!');
showError('Algo deu errado');
showWarning('Atenção necessária');
showInfo('Informação importante');

// Toast de carregamento
const loadingToast = showLoading('Processando...');
// Atualizar posteriormente
updateToast(loadingToast, {
    render: 'Concluído!',
    type: 'success',
    isLoading: false
});
```

## Integração Atual no Projeto

### Auth Store (src/stores/auth.ts)
```typescript
// Login bem-sucedido
if (event === 'SIGNED_IN') {
    toast.success(`Bem-vindo, ${session.user.email}!`);
}

// Logout
if (event === 'SIGNED_OUT') {
    toast.info('Você foi desconectado com sucesso');
}

// Erros de perfil
toast.error('Erro ao verificar perfil do usuário');
```

### Login Component (src/views/Login.vue)
```typescript
// Validação de campos
if (!email.value || !password.value) {
    toast.warning('Por favor, preencha todos os campos');
    return;
}

// Diferentes tipos de erro de login
if (error.message.includes('Invalid login credentials')) {
    toast.error('Email ou senha incorretos');
} else if (error.message.includes('Email not confirmed')) {
    toast.warning('Confirme seu email antes de fazer login');
} else {
    toast.error(`Erro no login: ${error.message}`);
}
```

## API do Composable useToast

### Métodos Disponíveis

```typescript
const {
    showSuccess,    // (message: string, options?: ToastOptions) => void
    showError,      // (message: string, options?: ToastOptions) => void
    showWarning,    // (message: string, options?: ToastOptions) => void
    showInfo,       // (message: string, options?: ToastOptions) => void
    showLoading,    // (message?: string) => toastId
    updateToast,    // (toastId, config) => void
    toast,          // Acesso direto ao toast original
} = useToast();
```

### Opções Personalizadas
```typescript
// Com opções personalizadas
showSuccess('Mensagem', {
    autoClose: 5000,      // 5 segundos
    position: 'bottom-center',
    theme: 'dark',
    hideProgressBar: true,
});
```

## Tipos de Toast Disponíveis

| Tipo | Método | Uso Recomendado |
|------|--------|-----------------|
| **Success** | `showSuccess()` | Operações concluídas com êxito |
| **Error** | `showError()` | Erros e falhas |
| **Warning** | `showWarning()` | Avisos e validações |
| **Info** | `showInfo()` | Informações gerais |
| **Loading** | `showLoading()` | Operações em andamento |

## Exemplos Práticos

### 1. Operações CRUD
```typescript
// Criar
const { showSuccess, showError, showLoading, updateToast } = useToast();

const saveData = async () => {
    const toastId = showLoading('Salvando dados...');

    try {
        await apiCall();
        updateToast(toastId, {
            render: 'Dados salvos com sucesso!',
            type: 'success',
            isLoading: false
        });
    } catch (error) {
        updateToast(toastId, {
            render: 'Erro ao salvar dados',
            type: 'error',
            isLoading: false
        });
    }
};
```

### 2. Validações de Formulário
```typescript
const validateForm = () => {
    if (!name.value) {
        showWarning('Nome é obrigatório');
        return false;
    }

    if (!email.value || !isValidEmail(email.value)) {
        showError('Email inválido');
        return false;
    }

    showInfo('Formulário válido!');
    return true;
};
```

### 3. Operações Assíncronas
```typescript
const deleteItem = async (id: string) => {
    try {
        await api.delete(`/items/${id}`);
        showSuccess('Item removido com sucesso!');
        await refreshList();
    } catch (error) {
        showError('Erro ao remover item. Tente novamente.');
    }
};
```

## Posições Disponíveis

- `top-left`
- `top-center`
- `top-right` (padrão)
- `bottom-left`
- `bottom-center`
- `bottom-right`

## Temas Disponíveis

- `auto` (padrão) - Segue o tema do sistema
- `light` - Tema claro
- `dark` - Tema escuro
- `colored` - Colorido

## Boas Práticas

1. **Use mensagens claras e concisas**
2. **Prefira o composable `useToast`** ao invés de importação direta
3. **Para operações longas**, use `showLoading()` com `updateToast()`
4. **Evite muitos toasts simultâneos** - podem sobrecarregar o usuário
5. **Use tipos apropriados** - success para sucesso, error para erros, etc.

## Customização de Estilos

O CSS do vue3-toastify pode ser sobrescrito em `src/index.css`:

```css
/* Customizar cor do toast de sucesso */
.Toastify__toast--success {
    background-color: #10b981;
}

/* Customizar posição */
.Toastify__toast-container {
    top: 80px; /* Ajustar para header fixo */
}
```

---

**Documentação criada em:** 2025-09-24
**Versão do vue3-toastify:** 0.2.8
**Projeto:** Korys Health Vue App