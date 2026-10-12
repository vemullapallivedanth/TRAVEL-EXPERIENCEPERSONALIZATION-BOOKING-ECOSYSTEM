// ==========================================
// GET TRANSPORTATION ID
// ==========================================

const urlParams =
    new URLSearchParams(window.location.search);

const transportationId =
    urlParams.get("id");


// ==========================================
// GLOBAL TRANSPORTATION DATA
// ==========================================

let transportationData = null;


// ==========================================
// LOAD TRANSPORTATION
// ==========================================

async function loadTransportationDetails() {

    const container =
        document.getElementById(
            "transportationDetails"
        );


    if (!transportationId) {

        container.innerHTML = `
            <div class="error-message">

                <h3>
                    Transportation not found
                </h3>

                <p>
                    No transportation ID was provided.
                </p>

                <button
                    class="book-btn"
                    onclick="goBack()"
                >
                    Back to Transportation
                </button>

            </div>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/${transportationId}`
        );


        if (!response.ok) {

            throw new Error(
                "Transportation not found"
            );
        }


        transportationData =
            await response.json();


        renderTransportation();


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="error-message">

                <h3>
                    Failed to load transportation
                </h3>

                <p>
                    ${error.message}
                </p>

                <button
                    class="book-btn"
                    onclick="goBack()"
                >
                    Back to Transportation
                </button>

            </div>
        `;
    }
}


// ==========================================
// DISPLAY TRANSPORTATION
// ==========================================

function renderTransportation() {

    const container =
        document.getElementById(
            "transportationDetails"
        );


    const item =
        transportationData;


    container.innerHTML = `

        <!-- ==================================
             LEFT SIDE
             ================================== -->

        <div class="transport-booking-left">

            <span class="package-label">
                TRANSPORTATION
            </span>


            <h1>
                ${item.provider}
            </h1>


            <div class="transport-route">

                <span class="location-icon">
                    📍
                </span>

                <strong>
                    ${item.source}
                </strong>

                <span class="route-arrow">
                    →
                </span>

                <strong>
                    ${item.destination}
                </strong>

            </div>


            <!-- DETAILS -->

            <div class="transport-detail-grid">


                <div class="transport-detail-card">

                    <span>
                        Transportation
                    </span>

                    <strong>
                        ${item.type}
                    </strong>

                </div>


                <div class="transport-detail-card">

                    <span>
                        Provider
                    </span>

                    <strong>
                        ${item.provider}
                    </strong>

                </div>


                <div class="transport-detail-card">

                    <span>
                        Departure
                    </span>

                    <strong>
                        ${item.departure_time || "N/A"}
                    </strong>

                </div>


                <div class="transport-detail-card">

                    <span>
                        Arrival
                    </span>

                    <strong>
                        ${item.arrival_time || "N/A"}
                    </strong>

                </div>


            </div>


            <!-- ROUTE INFORMATION -->

            <div class="transport-info-box">

                <h2>
                    Journey Details
                </h2>

                <p>
                    Travel from
                    <strong>
                        ${item.source}
                    </strong>
                    to
                    <strong>
                        ${item.destination}
                    </strong>.
                </p>

                <p>
                    Provider:
                    <strong>
                        ${item.provider}
                    </strong>
                </p>

                <p>
                    Transportation Type:
                    <strong>
                        ${item.type}
                    </strong>
                </p>

            </div>


            <!-- PRICE -->

            <div class="transport-price-box">

                <span>
                    Price / Traveller
                </span>

                <strong>
                    ₹${Number(
                        item.price || 0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>


        </div>


        <!-- ==================================
             RIGHT SIDE
             ================================== -->

        <div class="transport-booking-card">

            <h2>
                Confirm Your Booking
            </h2>


            <p class="booking-subtitle">
                Select the number of travellers.
            </p>


            <!-- TRAVELLERS -->

            <label
                for="numberOfTravellers"
            >
                Number of Travellers
            </label>


            <input
                type="number"
                id="numberOfTravellers"
                value="1"
                min="1"
                max="20"
                oninput="calculateTotal()"
            >


            <!-- TOTAL -->

            <div class="booking-total">

                <span>
                    Total Amount
                </span>

                <strong id="totalAmount">
                    ₹${Number(
                        item.price || 0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>


            <!-- CONFIRM -->

            <button
                class="confirm-booking-btn"
                onclick="confirmTransportationBooking()"
            >
                Confirm Booking
            </button>


            <!-- BACK -->

            <button
                class="back-booking-btn"
                onclick="goBack()"
            >
                ← Back to Transportation
            </button>

        </div>

    `;


    calculateTotal();
}


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateTotal() {

    if (!transportationData) {
        return;
    }


    const input =
        document.getElementById(
            "numberOfTravellers"
        );


    const totalElement =
        document.getElementById(
            "totalAmount"
        );


    if (!input || !totalElement) {
        return;
    }


    let travellers =
        parseInt(input.value);


    if (
        isNaN(travellers) ||
        travellers < 1
    ) {

        travellers = 1;

        input.value = 1;
    }


    const total =
        Number(transportationData.price || 0) *
        travellers;


    totalElement.textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


// ==========================================
// CONFIRM BOOKING
// ==========================================

async function confirmTransportationBooking() {

    const token =
        getToken();


    if (!token) {

        alert(
            "Please login before booking transportation."
        );

        window.location.href =
            "login.html";

        return;
    }


    const input =
        document.getElementById(
            "numberOfTravellers"
        );


    const numberOfTravellers =
        parseInt(input.value);


    if (
        isNaN(numberOfTravellers) ||
        numberOfTravellers <= 0
    ) {

        alert(
            "Please enter a valid number of travellers."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation-bookings/`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify({

                    transportationId:
                        Number(transportationId),

                    numberOfTravellers:
                        numberOfTravellers

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Booking failed"
            );
        }


        showBookingSuccess(
            data.booking
        );


    } catch (error) {

        console.error(error);


        alert(
            "Booking failed: " +
            error.message
        );
    }
}


// ==========================================
// SUCCESS SCREEN
// ==========================================

function showBookingSuccess(booking) {

    const container =
        document.getElementById(
            "transportationDetails"
        );


    container.innerHTML = `

        <div class="booking-success">

            <div class="success-icon">
                ✓
            </div>


            <h1>
                Booking Confirmed!
            </h1>


            <p>
                Your transportation booking
                has been successfully confirmed.
            </p>


            <div class="success-details">

                <div>

                    <span>
                        Booking ID
                    </span>

                    <strong>
                        ${booking.id}
                    </strong>

                </div>


                <div>

                    <span>
                        Provider
                    </span>

                    <strong>
                        ${booking.provider}
                    </strong>

                </div>


                <div>

                    <span>
                        Route
                    </span>

                    <strong>
                        ${booking.source}
                        →
                        ${booking.destination}
                    </strong>

                </div>


                <div>

                    <span>
                        Travellers
                    </span>

                    <strong>
                        ${booking.numberOfTravellers}
                    </strong>

                </div>


                <div>

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹${Number(
                            booking.totalAmount
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div>

                    <span>
                        Status
                    </span>

                    <strong class="confirmed">
                        ${booking.status}
                    </strong>

                </div>

            </div>


            <div class="success-buttons">

                <button
                    class="confirm-booking-btn"
                    onclick="window.location.href='dashboard.html'"
                >
                    Go to Dashboard
                </button>


                <button
                    class="back-booking-btn"
                    onclick="window.location.href='transportation.html'"
                >
                    Book Another Transportation
                </button>

            </div>

        </div>

    `;
}


// ==========================================
// BACK
// ==========================================

function goBack() {

    window.location.href =
        "transportation.html";
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadTransportationDetails
);