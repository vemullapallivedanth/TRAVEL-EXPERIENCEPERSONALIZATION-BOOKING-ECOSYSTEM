// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

    const token =
        localStorage.getItem("travelx_token");


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/users/me`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load profile"
            );
        }


        const user =
            await response.json();


        // ======================================
        // USER NAME
        // ======================================

        const nameElement =
            document.getElementById(
                "userName"
            );


        if (nameElement) {

            nameElement.textContent =
                user.name;
        }


        // ======================================
        // EMAIL
        // ======================================

        const emailElement =
            document.getElementById(
                "userEmail"
            );


        if (emailElement) {

            emailElement.textContent =
                user.email;
        }


        // ======================================
        // DESTINATION
        // ======================================

        const destinationElement =
            document.getElementById(
                "userDestination"
            );


        if (destinationElement) {

            destinationElement.textContent =
                user.preferredDestination ||
                "Not specified";
        }


        // ======================================
        // BUDGET
        // ======================================

        const budgetElement =
            document.getElementById(
                "userBudget"
            );


        if (budgetElement) {

            budgetElement.textContent =
                `₹${Number(
                    user.budget || 0
                ).toLocaleString("en-IN")}`;
        }


        // ======================================
        // TRIP DURATION
        // ======================================

        const durationElement =
            document.getElementById(
                "userDuration"
            );


        if (durationElement) {

            durationElement.textContent =
                `${user.tripDuration || 0} Days`;
        }


        // ======================================
        // INTERESTS
        // ======================================

        const interestsElement =
            document.getElementById(
                "userInterests"
            );


        if (interestsElement) {

            interestsElement.textContent =
                user.interests ||
                "Not specified";
        }


        // ======================================
        // LOAD OTHER DATA
        // ======================================

        await loadRecommendations();

        await loadBookings();

        await loadTransportationBookings();


    } catch (error) {

        console.error(error);


        alert(
            "Session expired. Please login again."
        );


        localStorage.removeItem(
            "travelx_token"
        );

        localStorage.removeItem(
            "travelx_user"
        );


        window.location.href =
            "login.html";
    }
}


// ==========================================
// RECOMMENDATIONS
// ==========================================

async function loadRecommendations() {

    const container =
        document.getElementById(
            "recommendations"
        );


    if (!container) {
        return;
    }


    const token =
        localStorage.getItem(
            "travelx_token"
        );


    try {

        const response = await fetch(
            `${API_BASE_URL}/recommendations`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load recommendations"
            );
        }


        const recommendations =
            await response.json();


        if (
            !recommendations ||
            recommendations.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No recommendations yet
                    </h3>

                    <p>
                        Update your travel preferences
                        to get personalized packages.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            recommendations.map(item => {

                return `

                    <div class="travel-card">

                        <span class="badge">
                            ${item.score || 0} Match
                        </span>

                        <h2>
                            ${item.packageName}
                        </h2>

                        <p>
                            📍 ${item.destination}
                        </p>

                        <p>
                            🗓 ${item.duration}
                            Days
                        </p>

                        <p>
                            💰 ₹${Number(
                                item.price || 0
                            ).toLocaleString("en-IN")}
                        </p>

                        <button
                            class="book-btn"
                            onclick="openPackage(${item.id})"
                        >
                            View Package
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <p>
                Failed to load recommendations.
            </p>
        `;
    }
}


// ==========================================
// OPEN PACKAGE
// ==========================================

function openPackage(packageId) {

    window.location.href =
        `booking.html?id=${packageId}`;
}


// ==========================================
// LOAD TRAVEL PACKAGE BOOKINGS
// ==========================================

async function loadBookings() {

    const container =
        document.getElementById(
            "bookings"
        );


    if (!container) {
        return;
    }


    const token =
        localStorage.getItem(
            "travelx_token"
        );


    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/my`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );
        }


        const bookings =
            await response.json();


        if (
            !bookings ||
            bookings.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No travel package bookings
                    </h3>

                    <p>
                        Book a travel package
                        to see it here.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            bookings.map(booking => {

                const packageData =
                    booking.travelPackage || {};


                return `

                    <div class="travel-card">

                        <span class="badge">
                            ${booking.status}
                        </span>

                        <h2>
                            ${
                                packageData.packageName ||
                                "Travel Package"
                            }
                        </h2>

                        <p>
                            📍
                            ${
                                packageData.destination ||
                                "N/A"
                            }
                        </p>

                        <p>
                            👥 Travellers:
                            <strong>
                                ${
                                    booking.numberOfTravellers
                                }
                            </strong>
                        </p>

                        <p>
                            💰 Total:
                            <strong>
                                ₹${Number(
                                    booking.totalAmount ||
                                    0
                                ).toLocaleString("en-IN")}
                            </strong>
                        </p>

                        <p>
                            🗓 Booking Date:
                            ${
                                formatDate(
                                    booking.bookingDate
                                )
                            }
                        </p>

                        ${
                            booking.status !==
                            "CANCELLED"
                            ?

                            `
                                <button
                                    class="book-btn"
                                    onclick="cancelBooking(
                                        ${booking.id}
                                    )"
                                >
                                    Cancel Booking
                                </button>
                            `

                            :

                            ""
                        }

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <p>
                Failed to load bookings.
            </p>
        `;
    }
}


// ==========================================
// CANCEL TRAVEL PACKAGE BOOKING
// ==========================================

async function cancelBooking(
    bookingId
) {

    const token =
        localStorage.getItem(
            "travelx_token"
        );


    if (!token) {

        alert("Please login.");

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/${bookingId}/cancel`,
            {
                method: "PUT",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Cancellation failed"
            );
        }


        alert(
            "Travel package booking cancelled successfully."
        );


        await loadBookings();


    } catch (error) {

        console.error(error);


        alert(
            "Cancellation failed: " +
            error.message
        );
    }
}


// ==========================================
// LOAD TRANSPORTATION BOOKINGS
// ==========================================

async function loadTransportationBookings() {

    const container =
        document.getElementById(
            "transportationBookings"
        );


    if (!container) {
        return;
    }


    const token =
        localStorage.getItem(
            "travelx_token"
        );


    if (!token) {

        container.innerHTML = `
            <p>
                Please login to view bookings.
            </p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation-bookings/my`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load transportation bookings"
            );
        }


        const bookings =
            await response.json();


        if (
            !bookings ||
            bookings.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No transportation bookings
                    </h3>

                    <p>
                        Book a flight or bus
                        for your next trip.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            bookings.map(booking => {

                return `

                    <div class="travel-card">

                        <span class="badge">
                            ${booking.status}
                        </span>

                        <span class="badge">
                            ${booking.type}
                        </span>

                        <h2>
                            ${booking.provider}
                        </h2>

                        <p>
                            📍
                            ${booking.source}
                            →
                            ${booking.destination}
                        </p>

                        <p>
                            👥 Travellers:
                            <strong>
                                ${
                                    booking.numberOfTravellers
                                }
                            </strong>
                        </p>

                        <p>
                            🕐 Departure:
                            <strong>
                                ${
                                    booking.departureTime ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <p>
                            🕐 Arrival:
                            <strong>
                                ${
                                    booking.arrivalTime ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <p>
                            💰 Total:
                            <strong>
                                ₹${Number(
                                    booking.totalAmount ||
                                    0
                                ).toLocaleString("en-IN")}
                            </strong>
                        </p>

                        <p>
                            🗓 Booking Date:
                            ${
                                formatDate(
                                    booking.bookingDate
                                )
                            }
                        </p>

                        ${
                            booking.status !==
                            "CANCELLED"
                            ?

                            `
                                <button
                                    class="book-btn"
                                    onclick="cancelTransportationBooking(
                                        ${booking.id}
                                    )"
                                >
                                    Cancel Booking
                                </button>
                            `

                            :

                            ""
                        }

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <p>
                Failed to load transportation bookings.
            </p>
        `;
    }
}


// ==========================================
// CANCEL TRANSPORTATION BOOKING
// ==========================================

async function cancelTransportationBooking(
    bookingId
) {

    const token =
        localStorage.getItem(
            "travelx_token"
        );


    if (!token) {

        alert("Please login.");

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to cancel this transportation booking?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation-bookings/${bookingId}/cancel`,
            {
                method: "PUT",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Cancellation failed"
            );
        }


        alert(
            "Transportation booking cancelled successfully."
        );


        await loadTransportationBookings();


    } catch (error) {

        console.error(error);


        alert(
            "Cancellation failed: " +
            error.message
        );
    }
}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "N/A";
    }


    try {

        return new Date(
            dateValue
        ).toLocaleDateString(
            "en-IN"
        );

    } catch (error) {

        return dateValue;
    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "travelx_token"
    );

    localStorage.removeItem(
        "travelx_user"
    );


    window.location.href =
        "login.html";
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);