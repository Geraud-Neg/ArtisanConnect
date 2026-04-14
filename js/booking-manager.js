// js/booking-manager.js

class BookingManager {
    constructor() {
        this.storageKey = 'artisan_bookings';
        this.initStorage();
    }

    initStorage() {
        // Force la réinitialisation des données pour que la nouvelle démo fonctionne
        const currentVersion = 'v3';
        if (localStorage.getItem('booking_version') !== currentVersion) {
            localStorage.removeItem(this.storageKey);
            localStorage.setItem('booking_version', currentVersion);
        }

        if (!localStorage.getItem(this.storageKey)) {
            // Initialiser avec quelques données factices pour la démonstration
            const mockData = [
                {
                    id: 'RES-001',
                    artisanId: '1',
                    artisanName: 'Marc Dubois',
                    clientId: 'client_123',
                    clientName: 'Moi (Client)',
                    clientPhone: '+229 01 02 03 04 05',
                    service: 'Dépannage express',
                    date: 'Demain',
                    time: '14:00 - 15:00',
                    status: 'pending', // pending, confirmed, paid, completed_by_artisan, completed
                    amount: 20000,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'RES-002',
                    artisanId: '1',
                    artisanName: 'Marc Dubois',
                    clientId: 'client_123',
                    clientName: 'Moi (Client)',
                    clientPhone: '+229 98 76 54 32',
                    clientAddress: 'Haie vive, Cotonou',
                    service: 'Installation chauffe-eau',
                    date: '12 Juin 2026',
                    time: '09:00 - 12:00',
                    status: 'confirmed',
                    amount: 45000,
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'RES-003',
                    artisanId: '1',
                    artisanName: 'Marc Dubois',
                    clientId: 'client_123',
                    clientName: 'Moi (Client)',
                    clientPhone: '+229 55 55 55 55',
                    service: 'Fuite tuyauterie',
                    date: 'Aujourd\'hui',
                    time: '10:00 - 11:00',
                    status: 'paid',
                    amount: 25000,
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(mockData));
        }
    }

    getAllBookings() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    getArtisanBookings(artisanId) {
        let bookings = this.getAllBookings();
        if(artisanId) {
             bookings = bookings.filter(b => String(b.artisanId) === String(artisanId));
        }
        return bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getClientBookings(clientName = 'Mon Compte') {
        // Dans une vraie app, on filtrerait par clientId
        // Pour la maquette, on prend tout ce qui n'est pas Julien/Sara/Franck
        // ou on filtre par un clientId fictif.
        let bookings = this.getAllBookings();
        return bookings.filter(b => b.clientName === clientName || b.clientId === 'client_123').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    createBooking(bookingData) {
        const bookings = this.getAllBookings();
        const id = 'RES-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const newBooking = {
            ...bookingData,
            id: id,
            status: bookingData.status || 'pending',
            clientId: 'client_123', // Utilisateur courant factice
            clientName: bookingData.clientName || 'Me (Client)',
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem(this.storageKey, JSON.stringify(bookings));
        return id;
    }

    updateBookingStatus(id, newStatus) {
        const bookings = this.getAllBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index].status = newStatus;
            localStorage.setItem(this.storageKey, JSON.stringify(bookings));
            return true;
        }
        return false;
    }
}

window.bookingManager = new BookingManager();
