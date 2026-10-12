// ==========================================
// LOAD TRANSPORTATION
// ==========================================

async function loadTransportation() {

    const container =
        document.getElementById("transportationList");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load transportation"
            );
        }

        const transportation =
            await response.json();

        if (
            !transportation ||
            transportation.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No transportation available
                    </h3>

                    <p>
                        Please check again later.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            transportation.map(item => {

                return `

                    <div class="travel-card">

                        <span class="badge">
                            ${item.type}
                        </span>

                        <h2>
                            ${item.provider}
                        </h2>

                        <p>
                            📍
                            ${item.source}
                            →
                            ${item.destination}
                        </p>

                        <p>
                            🕐 Departure:
                            <strong>
                                ${item.departure_time || "N/A"}
                            </strong>
                        </p>

                        <p>
                            🕐 Arrival:
                            <strong>
                                ${item.arrival_time || "N/A"}
                            </strong>
                        </p>

                        <div class="card-info">

                            <strong>
                                ₹${Number(
                                    item.price || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                            <button
                                class="book-btn"
                                onclick="bookTransportation(${item.id})"
                            >
                                Book Now
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error-message">

                <h3>
                    Failed to fetch transportation
                </h3>

                <p>
                    Make sure the backend is running.
                </p>

            </div>
        `;
    }
}


// ==========================================
// BOOK TRANSPORTATION
// ==========================================

async function bookTransportation(
    transportationId
) {

    const token =
        localStorage.getItem("travelx_token");


    if (!token) {

        alert(
            "Please login before booking transportation."
        );

        window.location.href =
            "login.html";

        return;
    }


    const travellers =
        prompt(
            "Enter number of travellers:"
        );


    if (
        travellers === null ||
        travellers.trim() === ""
    ) {

        return;
    }


    const numberOfTravellers =
        parseInt(travellers);


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

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({

                    transportationId:
                        transportationId,

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


        alert(
            `Transportation booked successfully!\n\n` +
            `Booking ID: ${data.booking.id}\n` +
            `Provider: ${data.booking.provider}\n` +
            `Route: ${data.booking.source} → ${data.booking.destination}\n` +
            `Travellers: ${data.booking.numberOfTravellers}\n` +
            `Total Amount: ₹${Number(
                data.booking.totalAmount
            ).toLocaleString("en-IN")}`
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
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadTransportation
);
// ==========================================
// LOAD TRANSPORTATION
// ==========================================

async function loadTransportation() {

    const container =
        document.getElementById(
            "transportationList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load transportation"
            );
        }


        const transportation =
            await response.json();


        if (
            !transportation ||
            transportation.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No transportation available
                    </h3>

                    <p>
                        Please check again later.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            transportation.map(item => {

                return `

                    <div class="travel-card">

                        <span class="badge">
                            ${item.type}
                        </span>

                        <h2>
                            ${item.provider}
                        </h2>

                        <p>
                            📍
                            ${item.source}
                            →
                            ${item.destination}
                        </p>

                        <p>
                            🕐 Departure:
                            <strong>
                                ${
                                    item.departure_time ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <p>
                            🕐 Arrival:
                            <strong>
                                ${
                                    item.arrival_time ||
                                    "N/A"
                                }
                            </strong>
                        </p>

                        <div class="card-info">

                            <strong>
                                ₹${Number(
                                    item.price || 0
                                ).toLocaleString("en-IN")}
                            </strong>


                            <button
                                class="book-btn"
                                onclick="bookTransportation(${item.id})"
                            >
                                Book Now
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="error-message">

                <h3>
                    Failed to fetch transportation
                </h3>

                <p>
                    Make sure the backend is running.
                </p>

            </div>
        `;
    }
}


// ==========================================
// OPEN TRANSPORTATION BOOKING
// ==========================================

function bookTransportation(
    transportationId
) {

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


    window.location.href =
        `transportation-booking.html?id=${transportationId}`;
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadTransportation
);