const fs = require('fs');

const searchHtmlPath = 'search.html';
const indexHtmlPath = 'index.html';

const replacements = [
    // index.html specific replacements
    { search: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', replace: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://images.unsplash.com/photo-1601599561096-f87c95fff1e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', replace: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', replace: 'assets/carpentry_img.png' },
    { search: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', replace: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },

    // picsum photos in search.html
    { search: 'https://picsum.photos/seed/plombier2/800/400', replace: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/eau/800/400', replace: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/macon/800/400', replace: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/carreleur/800/400', replace: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/plafond/800/400', replace: 'assets/plafond_img.png' },
    { search: 'https://picsum.photos/seed/clim/800/400', replace: 'assets/clim_img.png' },
    { search: 'https://picsum.photos/seed/elecauto/800/400', replace: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/soudeur/800/400', replace: 'assets/soudeur_img.png' },
    { search: 'https://picsum.photos/seed/couture/800/400', replace: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/coiffeur/800/400', replace: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/meca/800/400', replace: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/pneu/800/400', replace: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/phone/800/400', replace: 'assets/phone_img.png' },

    // seeds from update_artisans.js
    { search: 'https://picsum.photos/seed/elec1/800/400', replace: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/menuiserie1/800/400', replace: 'assets/carpentry_img.png' },
    { search: 'https://picsum.photos/seed/peintre1/800/400', replace: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/elec2/800/400', replace: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/menuiserie2/800/400', replace: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/peintre2/800/400', replace: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/nettoyage1/800/400', replace: 'assets/cleaning_img.png' },
    { search: 'https://picsum.photos/seed/nettoyage2/800/400', replace: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/macon2/800/400', replace: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/carreleur2/800/400', replace: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/plafond2/800/400', replace: 'assets/plafond_img.png' },
    { search: 'https://picsum.photos/seed/clim2/800/400', replace: 'assets/clim_img.png' },
    { search: 'https://picsum.photos/seed/elecauto2/800/400', replace: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/soudeur2/800/400', replace: 'assets/soudeur_img.png' },
    { search: 'https://picsum.photos/seed/couture2/800/400', replace: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/coiffeur2/800/400', replace: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/meca2/800/400', replace: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/pneu2/800/400', replace: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { search: 'https://picsum.photos/seed/tel2/800/400', replace: 'assets/phone_img.png' },
];

function replaceImagesInFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: \${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const item of replacements) {
        if (content.includes(item.search)) {
            // Escape any regex special char like '?' in search url strings although simple string replace could also work 
            // We use string replace with global flag manually handled by replacing one by one if split/join
            content = content.split(item.search).join(item.replace);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated images in \${filePath}`);
    } else {
        console.log(`No images replaced in \${filePath}`);
    }
}

replaceImagesInFile(searchHtmlPath);
replaceImagesInFile(indexHtmlPath);

// Update update_artisans.js for future reference if you run it again
let updateJsContent = fs.readFileSync('update_artisans.js', 'utf8');
// For update_artisans.js it uses dynamic template literals, let's just do a blanket replacement in it to prevent recreating bad images
if (updateJsContent.includes('\`https://picsum.photos/seed/\${a.seed}/800/400\`')) {
    updateJsContent = updateJsContent.replace(
        /\`https:\/\/picsum\.photos\/seed\/\$\{a\.seed\}\/800\/400\`/g, 
        '(a.seed === "elec1" ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "menuiserie1" ? "assets/carpentry_img.png" : ' +
        'a.seed === "peintre1" ? "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "elec2" ? "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "menuiserie2" ? "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "peintre2" ? "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "nettoyage1" ? "assets/cleaning_img.png" : ' +
        'a.seed === "nettoyage2" ? "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "macon2" ? "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "carreleur2" ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "plafond2" ? "assets/plafond_img.png" : ' +
        'a.seed === "clim2" ? "assets/clim_img.png" : ' +
        'a.seed === "elecauto2" ? "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "soudeur2" ? "assets/soudeur_img.png" : ' +
        'a.seed === "couture2" ? "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "coiffeur2" ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "meca2" ? "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "pneu2" ? "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : ' +
        'a.seed === "tel2" ? "assets/phone_img.png" : ' +
        '\`https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80\`)'
    );
    fs.writeFileSync('update_artisans.js', updateJsContent, 'utf8');
    console.log('Successfully updated update_artisans.js');
}

console.log("Done.");
