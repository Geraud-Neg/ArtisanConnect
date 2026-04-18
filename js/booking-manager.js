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

    async getAllBookings() {
        try {
            const res = await fetch('http://localhost:3000/api/bookings');
            const data = await res.json();
            return data.success ? data.bookings : JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (e) {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); // Fallback
        }
    }

    async getArtisanBookings(artisanId) {
        let bookings = await this.getAllBookings();
        if(artisanId) {
             bookings = bookings.filter(b => String(b.artisanId) === String(artisanId) || String(b.artisan_id) === String(artisanId));
        }
        return bookings.sort((a,b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    }

    async getClientBookings(clientName = 'Mon Compte') {
        let bookings = await this.getAllBookings();
        return bookings.filter(b => b.clientName === clientName || b.clientId === 'client_123' || b.client_id !== undefined).sort((a,b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    }

    async createBooking(bookingData) {
        try {
            const res = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Mapper pour le Backend MySQL
                body: JSON.stringify({
                    client_id: 1, // Fix temporaire
                    artisan_id: bookingData.artisanId ? parseInt(bookingData.artisanId) : 2,
                    service: bookingData.service,
                    amount: bookingData.amount || 0
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update local storage backup
                const local = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
                local.push({ ...bookingData, id: data.booking.id, status: 'pending' });
                localStorage.setItem(this.storageKey, JSON.stringify(local));
                return data.booking.id;
            }
        } catch (e) {
            console.warn("API Error, fallback to LocalStorage");
        }

        // Fallback
        const bookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const id = 'RES-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const newBooking = {
            ...bookingData,
            id: id,
            status: bookingData.status || 'pending',
            clientId: 'client_123',
            clientName: bookingData.clientName || 'Me (Client)',
            createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem(this.storageKey, JSON.stringify(bookings));
        return id;
    }

    async updateBookingStatus(id, newStatus) {
        try {
            const res = await fetch(`http://localhost:3000/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            await res.json();
            
            // Background update local storage
            const bookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const index = bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                bookings[index].status = newStatus;
                localStorage.setItem(this.storageKey, JSON.stringify(bookings));
            }
            return true;
        } catch(e) {
            // Fallback
            const bookings = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            const index = bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                bookings[index].status = newStatus;
                localStorage.setItem(this.storageKey, JSON.stringify(bookings));
                return true;
            }
            return false;
        }
    }
}

window.bookingManager = new BookingManager();
