// js/auth.js
// Logic for handling user authentication state via a Dynamic Modal Overlay

const AuthManager = {
    storageKey: 'currentUser',
    usersKey: 'artisan_accounts',
    modalInjected: false,

    // Base de données simulée pour les utilisateurs
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        if(!users) {
            // Utilisateurs de démonstration par défaut
            const defaultUsers = [
                { id: 'admin_1', email: 'admin@artisan.com', password: 'admin', role: 'admin', name: 'Administrateur' },
                { id: 'client_1', email: 'client@artisan.com', password: 'client', role: 'client', name: 'Client Test' },
                { id: 'artisan_1', email: 'artisan@artisan.com', password: 'artisan', role: 'artisan', name: 'Artisan Test' }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
            return defaultUsers;
        }
        return JSON.parse(users);
    },

    // Récupérer l'utilisateur actuel
    getCurrentUser() {
        const user = localStorage.getItem(this.storageKey);
        return user ? JSON.parse(user) : null;
    },

    // Vérifier si connecté (validation basique du token JWT simulé)
    isAuthenticated() {
        const user = this.getCurrentUser();
        // Vérification de la présence d'un token JWT simulé
        return user !== null && user.token !== undefined;
    },

    async login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Veuillez remplir tous les champs.' }; // A1
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.normalizeEmail(email), password })
            });
            const data = await response.json();
            
            if (!data.success) {
                return { success: false, message: data.message }; // A2
            }
            
            // Set current user mimicking JWT structure
            localStorage.setItem(this.storageKey, JSON.stringify(data.user));
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Login erreur:", error);
            return { success: false, message: 'Erreur réseau. Le serveur API est-il lancé ?' };
        }
    },

    async register(name, email, password, role = 'client') {
        if (!name || !email || !password) {
            return { success: false, message: 'Veuillez remplir tous les champs du formulaire.' }; // A1
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: this.normalizeEmail(email), password, role })
            });
            const data = await response.json();
            
            if (!data.success) {
                return { success: false, message: data.message };
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(data.user));
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Register erreur:", error);
            return { success: false, message: 'Erreur réseau. Le serveur API est-il lancé ?' };
        }
    },

    normalizeEmail(email) {
        return email ? email.trim().toLowerCase() : '';
    },

    // Déconnexion
    logout() {
        localStorage.removeItem(this.storageKey);
        window.location.href = 'index.html';
    },

    // Protéger une action (affiche la modale ou redirige si non connecté)
    requireAuth(resumeUrl = null) {
        if (!this.isAuthenticated()) {
            // Si on a un resumeUrl (ex: booking.html), on redirige vers la page d'inscription complète
            if (resumeUrl) {
                const type = resumeUrl.includes('booking') ? 'register' : 'login';
                window.location.href = `auth.html?redirect=${encodeURIComponent(resumeUrl)}&type=${type}`;
            } else {
                this.showAuthModal('register');
            }
            return false;
        }
        if (typeof resumeUrl === 'function') {
            resumeUrl();
        }
        return true;
    },

    // Injecter le HTML de la modale dans le body
    injectModalHTML() {
        if (this.modalInjected || document.getElementById('global-auth-modal')) return;

        const modalHTML = `
        <div id="global-auth-modal" style="display: none;" class="fixed inset-0 z-[999] flex items-center justify-center p-4 min-h-screen">
            <!-- Overlay sombre avec flou -->
            <div id="global-auth-backdrop" class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300 opacity-0 cursor-pointer"></div>

            <!-- Contenu de la modale -->
            <div id="global-auth-content" class="relative z-10 w-full max-w-4xl max-h-[95vh] flex flex-col md:flex-row bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
                
                <!-- Section Branding (Gauche) -->
                <div class="hidden md:flex flex-col flex-1 p-10 bg-primary/95 text-white justify-between relative overflow-hidden">
                    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                    <div class="relative z-10">
                        <div class="flex items-center space-x-2 text-2xl font-bold font-poppins text-white">
                            <i class="fa-solid fa-hammer text-secondary"></i>
                            <span>ArtisanConnect</span>
                        </div>
                        <h2 class="text-3xl font-bold mt-12 leading-tight font-poppins">Bienvenue dans votre espace !</h2>
                        <p class="mt-4 text-primary-light text-base">Inscrivez-vous pour réserver un artisan, gérer vos devis, ou proposer vos services.</p>
                        
                        <div class="mt-12 space-y-4">
                            <div class="flex items-center text-sm font-medium">
                                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3"><i class="fa-solid fa-shield-halved text-white"></i></div>
                                Plateforme 100% sécurisée
                            </div>
                            <div class="flex items-center text-sm font-medium">
                                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3"><i class="fa-solid fa-bolt text-secondary"></i></div>
                                Réservation rapide et facile
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Formulaire (Droite) -->
                <div class="flex-1 bg-white p-6 md:p-10 relative overflow-y-auto max-h-[95vh]">
                    
                    <!-- Bouton fermer -->
                    <button id="close-auth-modal" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 transition-smooth z-20">
                         <i class="fa-solid fa-xmark text-xl"></i>
                    </button>

                    <!-- Logo Mobile -->
                    <div class="md:hidden flex items-center mb-6">
                        <i class="fa-solid fa-hammer text-secondary text-2xl mr-2"></i>
                        <span class="text-primary text-2xl font-bold font-poppins">ArtisanConnect</span>
                    </div>

                    <!-- Toggles -->
                    <div class="flex space-x-6 mb-6 border-b border-gray-100 pb-2">
                        <button type="button" id="auth-tab-login" class="text-base font-poppins font-bold text-primary border-b-2 border-primary pb-2 transition-all">Connexion</button>
                        <button type="button" id="auth-tab-register" class="text-base font-poppins font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all">Inscription</button>
                    </div>

                    <!-- Zone de message d'erreur (A1, A2) -->
                    <div id="auth-error-message" class="hidden bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-4 flex items-start shadow-sm">
                        <i class="fa-solid fa-circle-exclamation mt-0.5 mr-2"></i>
                        <span id="auth-error-text">Message d'erreur...</span>
                    </div>

                    <!-- Formulaire Connexion -->
                    <form id="global-login-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Adresse Email</label>
                            <div class="relative">
                                <i class="fa-regular fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input type="email" id="login-email" class="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-smooth" placeholder="exemple@email.com">
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="block text-xs font-medium text-gray-700">Mot de passe</label>
                                <a href="#" class="text-[10px] text-secondary hover:underline transition-smooth">Mot de passe oublié ?</a>
                            </div>
                            <div class="relative">
                                <i class="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input type="password" id="login-password" class="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-smooth" placeholder="••••••••">
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-smooth shadow-md mt-6 text-sm flex items-center justify-center">
                            <span>Se Connecter</span> <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </button>
                        
                        <div class="mt-4 text-center text-xs text-gray-500">
                            Comptes démo: admin@artisan.com, client@artisan.com, artisan@artisan.com (mot de passe = nom du rôle)
                        </div>
                    </form>

                    <!-- Formulaire Inscription -->
                    <form id="global-register-form" style="display: none;" class="space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Prénom</label>
                                <input type="text" id="reg-firstname" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth" placeholder="Jean">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                                <input type="text" id="reg-lastname" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth" placeholder="Dupont">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Adresse Email</label>
                            <div class="relative">
                                <i class="fa-regular fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input type="email" id="reg-email" class="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth" placeholder="exemple@email.com">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Type de compte</label>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <label class="border border-gray-200 rounded p-2 flex items-center cursor-pointer hover:border-primary focus-within:ring-2 focus-within:ring-primary transition group bg-white shadow-sm">
                                    <input type="radio" name="authModalRole" value="client" checked class="text-primary focus:ring-primary h-3 w-3" onchange="document.getElementById('modal-artisan-fields').style.display='none'">
                                    <span class="ml-2 text-[11px] font-medium text-gray-700 group-hover:text-primary transition-colors">Je cherche un artisan</span>
                                </label>
                                <label class="border border-gray-200 rounded p-2 flex items-center cursor-pointer hover:border-primary focus-within:ring-2 focus-within:ring-primary transition group bg-white shadow-sm">
                                    <input type="radio" name="authModalRole" value="artisan" class="text-primary focus:ring-primary h-3 w-3" onchange="document.getElementById('modal-artisan-fields').style.display='grid'">
                                    <span class="ml-2 text-[11px] font-medium text-gray-700 group-hover:text-primary transition-colors">Je suis artisan</span>
                                </label>
                            </div>
                        </div>
                        <div id="modal-artisan-fields" style="display: none;" class="grid-cols-2 gap-3 mt-2">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Métier principal</label>
                                <select id="reg-metier" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth bg-white">
                                    <option value="" disabled selected>Choisir...</option>
                                    <option>Plomberie</option>
                                    <option>Électricité</option>
                                    <option>Menuiserie</option>
                                    <option>Peinture</option>
                                    <option>Nettoyage</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 mb-1">Localité</label>
                                <input type="text" id="reg-localite" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth" placeholder="Ex: Cotonou">
                            </div>
                            <div class="col-span-2 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p class="text-xs font-bold text-gray-900 mb-2 flex items-center">
                                    <i class="fa-solid fa-shield-halved mr-2 text-secondary"></i>
                                    Vérification de profil
                                </p>
                                <label class="block text-[13px] font-bold text-gray-900 mb-3 leading-tight">Possédez-vous des documents officiels (CQP, Registre de commerce, etc.) ?</label>
                                <div class="flex space-x-3 mb-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" name="modal_has_documents" value="yes" class="text-secondary focus:ring-secondary h-3 w-3" onchange="document.getElementById('modal-document-upload').style.display='block'">
                                        <span class="ml-1 text-[11px] font-medium text-gray-700">Oui, j'ai des documents</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="radio" name="modal_has_documents" value="no" class="text-secondary focus:ring-secondary h-3 w-3" checked onchange="document.getElementById('modal-document-upload').style.display='none'">
                                        <span class="ml-1 text-[11px] font-medium text-gray-700">Non j'ai pas</span>
                                    </label>
                                </div>
                                <div id="modal-document-upload" style="display: none;" class="mt-2 p-3 border border-dashed border-gray-300 rounded bg-white transition-smooth">
                                    <label class="block text-[11px] font-bold text-gray-700 mb-1">Joignez vos pièces</label>
                                    <input type="file" class="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-dark cursor-pointer" multiple>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Mot de passe</label>
                            <div class="relative">
                                <i class="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input type="password" id="reg-password" class="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-smooth" placeholder="••••••••">
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-smooth shadow-md mt-6 text-sm flex items-center justify-center">
                            <span>Créer mon compte</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalListeners();
        this.modalInjected = true;
    },

    showError(msg) {
        const errDiv = document.getElementById('auth-error-message');
        const errText = document.getElementById('auth-error-text');
        errText.textContent = msg;
        errDiv.classList.remove('hidden');
        
        // Petite animation
        errDiv.style.transform = 'translateY(-5px)';
        setTimeout(() => { errDiv.style.transform = 'translateY(0)'; }, 100);
    },

    hideError() {
        const errDiv = document.getElementById('auth-error-message');
        errDiv.classList.add('hidden');
    },

    setupModalListeners() {
        const modal = document.getElementById('global-auth-modal');
        const backdrop = document.getElementById('global-auth-backdrop');
        const content = document.getElementById('global-auth-content');
        const btnClose = document.getElementById('close-auth-modal');
        
        const tabLogin = document.getElementById('auth-tab-login');
        const tabRegister = document.getElementById('auth-tab-register');
        const formLogin = document.getElementById('global-login-form');
        const formRegister = document.getElementById('global-register-form');

        // Fermeture
        const closeMod = () => {
             backdrop.classList.remove('opacity-100');
             content.classList.remove('scale-100', 'opacity-100');
             content.classList.add('scale-95', 'opacity-0');
             setTimeout(() => { 
                 modal.style.display = 'none'; 
                 this.hideError();
             }, 300);
        };

        btnClose.onclick = closeMod;
        backdrop.onclick = closeMod;

        // Toggling Forms
        const toggleTo = (type) => {
            this.hideError(); // Reset errors when switching tab
            if(type === 'login') {
                formLogin.style.display = 'block';
                formRegister.style.display = 'none';
                tabLogin.className = 'text-base font-poppins font-bold text-primary border-b-2 border-primary pb-2 transition-all';
                tabRegister.className = 'text-base font-poppins font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer';
            } else {
                formLogin.style.display = 'none';
                formRegister.style.display = 'block';
                tabRegister.className = 'text-base font-poppins font-bold text-primary border-b-2 border-primary pb-2 transition-all';
                tabLogin.className = 'text-base font-poppins font-medium text-gray-400 hover:text-gray-600 pb-2 transition-all cursor-pointer';
            }
        };

        tabLogin.onclick = () => toggleTo('login');
        tabRegister.onclick = () => toggleTo('register');

        // Form Submit
        const handleSubmit = async (e, type) => {
            e.preventDefault();
            this.hideError(); // Reset previous errors

            let authResult;

            if (type === 'login') {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                authResult = await this.login(email, password);
            } else {
                const firstname = document.getElementById('reg-firstname').value.trim();
                const lastname = document.getElementById('reg-lastname').value.trim();
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;
                
                const roleInput = e.target.querySelector('input[name="authModalRole"]:checked');
                const role = roleInput ? roleInput.value : 'client';
                
                const fullName = firstname + (lastname ? ' ' + lastname : '');
                
                authResult = await this.register(fullName, email, password, role);
            }

            // Gérer les cas d'erreur alternatifs (A1, A2)
            if (!authResult.success) {
                this.showError(authResult.message);
                return; // Stop here!
            }
            
            // Succès: Redirection basée sur le JWT / Rôle (Cas Nominal 5)
            const user = authResult.user;
            
            // Reprendre là où l'user était si c'est pour une réservation (booking en cours)
            if(window.location.href.includes('booking.html')) {
                 // Si on est déjà sur booking.html, on recharge juste la page ou on affiche le contenu
                 document.body.style.display = ''; // reveal content just in case
                 window.location.reload(); 
            } else if (sessionStorage.getItem('current_booking')) {
                 // Si on voulait réserver depuis ailleurs, on va vers booking.html
                 window.location.href = 'booking.html';
            } else {
                 // Redirection vers le tableau de bord selon le rôle
                 if(user.role === 'artisan') {
                     window.location.href = 'dashboard-artisan.html';
                 } else if (user.role === 'admin') {
                     window.location.href = 'admin-kyc.html';
                 } else {
                     window.location.href = 'dashboard-client.html'; 
                 }
            }
        };

        formLogin.onsubmit = (e) => handleSubmit(e, 'login');
        formRegister.onsubmit = (e) => handleSubmit(e, 'register');
    },

    showAuthModal(type = 'login') {
        if(!this.modalInjected) this.injectModalHTML();

        const modal = document.getElementById('global-auth-modal');
        const backdrop = document.getElementById('global-auth-backdrop');
        const content = document.getElementById('global-auth-content');
        
        const tabLogin = document.getElementById('auth-tab-login');
        const tabRegister = document.getElementById('auth-tab-register');
        
        if (type === 'login') {
            tabLogin.click();
        } else {
            tabRegister.click();
        }

        modal.style.display = 'flex';
        // Petit délai pour déclencher la transition CSS
        setTimeout(() => {
            backdrop.classList.add('opacity-100');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
};

// Auto-inject au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.injectModalHTML();
});

window.AuthManager = AuthManager;
