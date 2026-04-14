const fs = require('fs');

const file = 'update_artisans.js';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    const replaces = [
        { from: 'https://images.unsplash.com/photo-1629853315998-132d7abda9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/plafond_img.png' },
        { from: 'https://images.unsplash.com/photo-1596700078709-66dc1eac1656?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/clim_img.png' },
        { from: 'https://images.unsplash.com/photo-1504322894672-9118c7c94411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/soudeur_img.png' },
        { from: 'https://images.unsplash.com/photo-1587834015694-817ab59fe41d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/phone_img.png' },
        { from: 'https://images.unsplash.com/photo-1611078810626-d372d8299bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/carpentry_img.png' },
        { from: 'https://images.unsplash.com/photo-1584820927498-cafe8c12f605?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', to: 'assets/cleaning_img.png' }
    ];

    let modified = false;
    for (const r of replaces) {
        if (content.includes(r.from)) {
            content = content.split(r.from).join(r.to);
            modified = true;
            console.log("Replaced in update_artisans.js: " + r.from);
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Saved changes to ' + file);
    }
}
