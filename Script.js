const SUPABASE_URL = 'https://zppgwmaikthhlfsshuor.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGd3bWFpa3RoaGxmc3NodW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NTQwNTQsImV4cCI6MjExMDUzMDA1NH0.VAw25Zs8Uz3-ukdfPCuTUYSd1ZPxPGSwiZ9hCET0ZUA';

// Inicializa o cliente com nome distinto para não conflitar com window.supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById('form-register');
    const formLogin = document.getElementById('form-login');
    const userEmailEl = document.getElementById('user-email');

    // 1. CADASTRO DE USUÁRIO
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const messageEl = document.getElementById('message');

            messageEl.style.color = '#555';
            messageEl.innerText = 'Criando conta...';

            const { error } = await supabaseClient.auth.signUp({ email, password });

            if (error) {
                messageEl.style.color = '#ff4d4f';
                messageEl.innerText = 'Erro ao registrar: ' + error.message;
            } else {
                messageEl.style.color = '#3ecf8e';
                messageEl.innerText = 'Conta criada com sucesso! Agora faça login.';
                formRegister.reset();
            }
        });
    }

    // 2. LOGIN DE USUÁRIO
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const messageEl = document.getElementById('message');

            messageEl.style.color = '#555';
            messageEl.innerText = 'Entrando...';

            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

            if (error) {
                messageEl.style.color = '#ff4d4f';
                messageEl.innerText = 'Erro no login: ' + error.message;
            } else {
                messageEl.style.color = '#3ecf8e';
                messageEl.innerText = 'Login realizado! Redirecionando...';
                window.location.href = 'dashboard.html';
            }
        });
    }

    // 3. PROTEÇÃO DA ÁREA RESTRITA (executa automaticamente no dashboard.html)
    if (userEmailEl) {
        verificarAcesso();
    }
});

async function verificarAcesso() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('user-email').innerText = 'Logado como: ' + session.user.email;
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}