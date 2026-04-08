/**
 * Emergency Blood Finder - Firebase Integration
 * Developed by: Aditya Prakash (GLA University)
 */

// 1. Firebase SDK Imports (Modular Approach)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tumhari Asli Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDRK-fTm6MtfJsAI1cUINy6xeDj3CfGoIc",
  authDomain: "bloodfinder-ddf0e.firebaseapp.com",
  projectId: "bloodfinder-ddf0e",
  storageBucket: "bloodfinder-ddf0e.firebasestorage.app",
  messagingSenderId: "597668643794",
  appId: "1:597668643794:web:6b2bc448d9563e71aefe0b",
  measurementId: "G-5ZEJHEZBFY"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // Helper: Advanced Toast Notification
    let toastTimeout;
    const showToast = (message, type = 'success') => {
        const box = document.getElementById('messageBox');
        const msgText = document.getElementById('messageText');
        const icon = box.querySelector('i');
        if (!box || !msgText) return;

        icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        box.style.borderLeftColor = type === 'success' ? '#10b981' : '#e11d48'; 
        msgText.innerText = message;
        
        clearTimeout(toastTimeout);
        box.classList.add('show');
        toastTimeout = setTimeout(() => { box.classList.remove('show'); }, 3500);
    };

    // -------------------------------------------------------------------
    // LOGIC 1: REGISTER DONOR TO FIREBASE
    // -------------------------------------------------------------------
    const regForm = document.getElementById('registrationForm');
    
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = regForm.querySelector('button[type="submit"]');
            
            // Get values
            const name = document.getElementById('regName').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const bloodGroup = document.getElementById('regBloodGroup').value;
            const city = document.getElementById('regCity').value.trim().toLowerCase(); 
            const lastDonated = document.getElementById('regDate').value || "First Time";

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
            submitBtn.disabled = true;

            try {
                // Save to Firestore 'donors' collection
                await addDoc(collection(db, "donors"), {
                    name: name,
                    phone: phone,
                    bloodGroup: bloodGroup,
                    city: city, 
                    displayCity: document.getElementById('regCity').value.trim(), 
                    lastDonated: lastDonated,
                    registeredAt: serverTimestamp()
                });
                
                showToast(`Welcome ${name}! You are now an active donor.`, 'success');
                regForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                showToast("Error registering donor. Try again.", 'error');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // -------------------------------------------------------------------
    // LOGIC 2: SEARCH DONORS FROM FIREBASE
    // -------------------------------------------------------------------
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const groupSelect = document.getElementById('searchBloodGroup').value;
            const cityInput = document.getElementById('searchCity').value.trim().toLowerCase();
            const resultsDiv = document.getElementById('searchResults');
            const listContainer = document.getElementById('donorsList');
            const resultCount = document.getElementById('resultCount');
            const submitBtn = searchForm.querySelector('button[type="submit"]');

            if (!groupSelect) {
                showToast("Please select a blood group first.", "error");
                return;
            }

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
            submitBtn.disabled = true;

            try {
                // Query Firestore: Match blood group AND city
                const donorsRef = collection(db, "donors");
                const q = query(donorsRef, 
                    where("bloodGroup", "==", groupSelect),
                    where("city", "==", cityInput)
                );

                const querySnapshot = await getDocs(q);
                const donors = [];
                
                querySnapshot.forEach((doc) => {
                    donors.push({ id: doc.id, ...doc.data() });
                });

                // Update UI
                listContainer.innerHTML = '';
                resultCount.innerText = donors.length;
                resultsDiv.style.display = 'block';

                if (donors.length > 0) {
                    donors.forEach(donor => {
                        const donorCard = document.createElement('div');
                        donorCard.className = 'donor-card';
                        donorCard.innerHTML = `
                            <div class="donor-info">
                                <div class="donor-header">
                                    <h4 class="donor-name">${donor.name}</h4>
                                    <span class="blood-badge">${donor.bloodGroup}</span>
                                </div>
                                <p class="text-muted donor-location">
                                    <i class="fa-solid fa-location-dot text-primary"></i> ${donor.displayCity}
                                </p>
                                <p class="donor-date"><i class="fa-solid fa-clock-rotate-left"></i> Last Donated: ${donor.lastDonated}</p>
                            </div>
                            <div class="donor-actions">
                                <a href="tel:${donor.phone}" class="btn btn-primary shadow-sm" style="padding: 10px 20px; font-size: 0.9rem;">
                                    <i class="fa-solid fa-phone"></i> Call Now
                                </a>
                            </div>
                        `;
                        listContainer.appendChild(donorCard);
                    });
                    showToast(`Found ${donors.length} matching donors nearby!`, 'success');
                } else {
                    listContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-droplet-slash"></i>
                            <p>No matching donors found in ${document.getElementById('searchCity').value}.</p>
                            <small class="text-muted">Try expanding your search area.</small>
                        </div>
                    `;
                    showToast("No exact matches found.", "error");
                }
                
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                console.error("Error searching documents: ", error);
                showToast("Error fetching results. Please check your connection.", "error");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});