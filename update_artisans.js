const fs = require('fs');

const searchHtmlPath = 'search.html';
const profileHtmlPath = 'profile-artisan.html';

const newArtisans = [
  { id: 2, name: 'Sarah K.', job: 'Électricienne', location: 'Akpakpa, Cotonou', price: 'Sur Devis', tag: 'Dispo', seed: 'elec1' },
  { id: 3, name: 'Atelier Boni', job: 'Menuiserie', location: 'Godomey', price: 'Sur Devis', tag: 'Ouvert', seed: 'menuiserie1' },
  { id: 4, name: 'Jean Peintre', job: 'Peinture', location: 'Fidjrossè', price: '15 000F / hr', tag: "Aujourd'hui", seed: 'peintre1' },
  { id: 18, name: 'Élec-Rapide', job: 'Électricien', location: 'Cotonou', price: '10 000F / hr', tag: 'Dispo', seed: 'elec2', about: 'Dépannage rapide toutes pannes électriques.' },
  { id: 19, name: 'Bois de Rêve', job: 'Menuiserie', location: 'Calavi', price: 'Sur Devis', tag: 'En semaine', seed: 'menuiserie2', about: 'Création de meubles sur demande.' },
  { id: 20, name: 'Couleurs Magiques', job: 'Peinture', location: 'Agla', price: '5 000F / m2', tag: 'Sur rdv', seed: 'peintre2', about: 'Peinture bâtiment et décoration intérieur.' },
  { id: 21, name: 'Propre Vite', job: 'Nettoyage', location: 'Cotonou (Haie Vive)', price: 'Dès 10 000F', tag: 'Dispo', seed: 'nettoyage1', about: 'Entretien de bureaux, nettoyage fin de chantier, maisons.' },
  { id: 22, name: 'Maison Éclatante', job: 'Nettoyage', location: 'Saint-Michel', price: '15 000F / jour', tag: 'Urgences', seed: 'nettoyage2', about: 'Services de grand nettoyage et ménage occasionnel.' },
  { id: 23, name: 'Constructions Béton', job: 'Maçon', location: 'Akpakpa', price: 'Sur Devis', tag: 'Pro', seed: 'macon2', about: 'Entreprise générale de maçonnerie, fondations et dalles.' },
  { id: 24, name: 'Marbres & Dalles', job: 'Carreleur', location: 'Fidjrossè', price: '4 000F / m2', tag: 'Dispo', seed: 'carreleur2', about: 'Spécialiste de la pose de marbre, travertin et faïence.' },
  { id: 25, name: 'Déco-Plafond', job: 'Poseur de faux-plafond', location: 'Cotonou', price: 'Sur Devis', tag: 'Devis Gratuit', seed: 'plafond2', about: 'Plafonds tendus, spots encastrés, et staff pour maisons de luxe.' },
  { id: 26, name: 'Froid Express', job: 'Technicien clim / froid', location: 'Godomey', price: '8 000F / hr', tag: 'Dispo 24/7', seed: 'clim2', about: 'Maintenance et nettoyage de vos splits ou climatiseurs centraux.' },
  { id: 27, name: 'Garage Auto-Éclair', job: 'Électricien auto / moto', location: 'Calavi', price: '10000F', tag: 'Rapide', seed: 'elecauto2', about: 'Experts en électronique embarquée et pannes de moteur.' },
  { id: 28, name: 'Métal-Pro', job: 'Soudeur / Ferronnier', location: 'Agla', price: 'Sur devis', tag: 'Ouvert', seed: 'soudeur2', about: 'Réalisation sur mesure : rampes, grilles, portes.' },
  { id: 29, name: 'Fils & Modes', job: 'Couturier / Tailleur', location: 'Maro-Militaire', price: 'Sur modèle', tag: 'Sur rdv', seed: 'couture2', about: 'Spécialiste de la mode africaine, wax, et mariages.' },
  { id: 30, name: 'Afro-Style', job: 'Coiffeur / Coiffeuse', location: 'Étoile Rouge', price: 'Dès 3000F', tag: 'Fermé', seed: 'coiffeur2', about: 'Tresses africaines, locks, nappy, on prend soin de vos cheveux.' },
  { id: 31, name: 'Diagnostic Auto', job: 'Mécanicien auto / moto', location: 'Cotonou', price: '15000F', tag: 'Expert', seed: 'meca2', about: 'Passage à la valise, diagnostics complets avant achat.' },
  { id: 32, name: 'Roues Secours', job: 'Vulcanisateur', location: 'Akpakpa', price: '500F', tag: '24/7', seed: 'pneu2', about: 'Intervention mobile pour crevaisons et changement de pneus.' },
  { id: 33, name: 'Mobile Doc', job: 'Réparateur téléphone', location: 'Gbégamey', price: 'Devis', tag: 'Dispo', seed: 'tel2', about: "Réparation d'iPhone, Android, remplacements écrans et batteries." }
];

let searchContent = fs.readFileSync(searchHtmlPath, 'utf8');

// The exact string that precedes the pagination block:
let searchNeedle = '                <!-- Pagination -->';
let insertionParts = searchContent.split(searchNeedle);

if (insertionParts.length > 1) {
    let cardsHtml = '';
    for (const a of newArtisans) {
        cardsHtml += `
                    <!-- Card ${a.id} (${a.job}) -->
                    <div class="bg-white rounded-card overflow-hidden border border-gray-100 shadow-sm hover:shadow-hover transition-smooth flex flex-col cursor-pointer" onclick="window.location.href='profile-artisan.html?id=${a.id}'">
                        <div class="h-40 bg-gray-200 relative">
                            <img src="https://picsum.photos/seed/${a.seed}/800/400" alt="${a.job}" class="w-full h-full object-cover">
                            <div class="absolute top-3 right-3 bg-white p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-smooth shadow-sm z-10" onclick="toggleHeart(event, this)">
                                <i class="fa-regular fa-heart"></i>
                            </div>
                        </div>
                        <div class="p-4 flex-1 flex flex-col">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="text-base font-bold text-gray-900 line-clamp-1 hover:text-primary">${a.name}</h3>
                                <div class="flex items-center text-xs">
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <span class="ml-1 font-bold">4.${Math.floor(Math.random() * 6) + 4}</span>
                                </div>
                            </div>
                            <p class="text-sm text-gray-500 mb-2">${a.job}</p>
                            <div class="text-xs text-gray-500 flex items-center mb-4">
                                <i class="fa-solid fa-location-dot mr-1"></i> ${a.location}
                            </div>
                            <div class="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span class="font-bold text-secondary text-sm">${a.price}</span>
                                <span class="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded">${a.tag}</span>
                            </div>
                        </div>
                    </div>`;
    }

    // Since we split by searchNeedle, we need to append the cards inside the grid div.
    let beforeGrid = insertionParts[0].trimEnd();
    if (beforeGrid.endsWith('</div>')) {
        beforeGrid = beforeGrid.substring(0, beforeGrid.length - 6);
    }
    
    let combined = beforeGrid + cardsHtml + '\\n                </div>\\n\\n                <!-- Pagination -->' + insertionParts[1];
    fs.writeFileSync(searchHtmlPath, combined);
    console.log('Successfully added cards to search.html');
} else {
    console.error('Could not find Pagination section in search.html');
}

let profileContent = fs.readFileSync(profileHtmlPath, 'utf8');

// Insert precisely before '};' in artisansData.
let dsInsertionPoint = profileContent.indexOf('};\\r\\n\\r\\n        window.addEventListener');
if (dsInsertionPoint === -1) {
    dsInsertionPoint = profileContent.indexOf('};\\n\\n        window.addEventListener');
}

if (dsInsertionPoint !== -1) {
    let jsData = '';
    for (const a of newArtisans) {
        if (a.id >= 18) {
            jsData += `,\\n            '${a.id}': {\\n                name: '${a.name.replace(/'/g, "\\\\'")}',\\n                job: '${a.job.replace(/'/g, "\\\\'")}',\\n                avatar: 'https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&size=400&background=random',\\n                location: 'Intervient : ${a.location.replace(/'/g, "\\\\'")}',\\n                price: '${a.price}',\\n                about: '${(a.about||'').replace(/'/g, "\\\\'")}'\\n            }`;
        }
    }
    profileContent = profileContent.substring(0, dsInsertionPoint) + jsData + '\\n        ' + profileContent.substring(dsInsertionPoint);
    fs.writeFileSync(profileHtmlPath, profileContent);
    console.log('Successfully appended datasets to profile-artisan.html');
} else {
    console.error('Could not find insertion point in profile-artisan.html');
}
