// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

requireAdmin();


// ==========================================
// LOAD DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSummary();

        loadDestinations();

        loadAccommodations();

        loadTransportation();

        loadPackages();

        loadBookings();

        loadTransportationBookings();

    }
);


// ==========================================
// SUMMARY
// ==========================================

async function loadSummary() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/reports/summary`,
            {
                headers: authHeaders()
            }
        );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        const users =
            document.getElementById(
                "totalUsers"
            );

        const destinations =
            document.getElementById(
                "totalDestinations"
            );

        const packages =
            document.getElementById(
                "totalPackages"
            );

        const bookings =
            document.getElementById(
                "totalBookings"
            );


        if (users) {
            users.textContent =
                data.totalUsers || 0;
        }

        if (destinations) {
            destinations.textContent =
                data.totalDestinations || 0;
        }

        if (packages) {
            packages.textContent =
                data.totalPackages || 0;
        }

        if (bookings) {
            bookings.textContent =
                data.totalBookings || 0;
        }


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// DESTINATIONS
// ==========================================

function showDestinationForm() {

    document.getElementById(
        "destinationForm"
    ).style.display = "block";
}


async function addDestination() {

    const data = {

        name:
            document.getElementById(
                "destinationName"
            ).value,

        state:
            document.getElementById(
                "destinationState"
            ).value,

        country:
            document.getElementById(
                "destinationCountry"
            ).value,

        category:
            document.getElementById(
                "destinationCategory"
            ).value,

        averageBudget:
            Number(
                document.getElementById(
                    "destinationBudget"
                ).value
            ),

        description:
            document.getElementById(
                "destinationDescription"
            ).value
    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/destinations/`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to add destination"
            );
        }


        alert(
            "Destination added successfully."
        );


        document.getElementById(
            "destinationForm"
        ).style.display = "none";


        loadDestinations();


    } catch (error) {

        alert(error.message);

    }
}


async function loadDestinations() {

    const container =
        document.getElementById(
            "destinationList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/destinations/`
        );


        const destinations =
            await response.json();


        container.innerHTML =
            destinations.map(item => {

                return `

                    <div class="admin-item">

                        <div>

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ${item.state || ""}
                                |
                                ${item.country}
                            </p>

                            <p>
                                ${item.category || "N/A"}
                            </p>

                        </div>


                        <button
                            class="admin-delete-btn"
                            onclick="deleteDestination(${item.id})"
                        >
                            Delete
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

    }
}


async function deleteDestination(id) {

    if (
        !confirm(
            "Delete this destination?"
        )
    ) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/destinations/${id}`,
            {
                method: "DELETE",

                headers: authHeaders()
            }
        );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.detail ||
                "Delete failed"
            );
        }


        loadDestinations();


    } catch (error) {

        alert(error.message);

    }
}


// ==========================================
// ACCOMMODATIONS
// ==========================================

function showAccommodationForm() {

    document.getElementById(
        "accommodationForm"
    ).style.display = "block";
}


async function addAccommodation() {

    const data = {

        name:
            document.getElementById(
                "accommodationName"
            ).value,

        destination:
            document.getElementById(
                "accommodationDestination"
            ).value,

        type:
            document.getElementById(
                "accommodationType"
            ).value,

        pricePerNight:
            Number(
                document.getElementById(
                    "accommodationPrice"
                ).value
            ),

        rating:
            Number(
                document.getElementById(
                    "accommodationRating"
                ).value
            ),

        facilities:
            document.getElementById(
                "accommodationFacilities"
            ).value
    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/accommodations/`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to add accommodation"
            );
        }


        alert(
            "Accommodation added successfully."
        );


        document.getElementById(
            "accommodationForm"
        ).style.display = "none";


        loadAccommodations();


    } catch (error) {

        alert(error.message);

    }
}


async function loadAccommodations() {

    const container =
        document.getElementById(
            "accommodationList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/accommodations/`
        );


        const accommodations =
            await response.json();


        container.innerHTML =
            accommodations.map(item => {

                return `

                    <div class="admin-item">

                        <div>

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ${item.destination}
                            </p>

                            <p>
                                ₹${Number(
                                    item.price_per_night ||
                                    0
                                ).toLocaleString("en-IN")}
                                / night
                            </p>

                        </div>


                        <button
                            class="admin-delete-btn"
                            onclick="deleteAccommodation(${item.id})"
                        >
                            Delete
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

    }
}


async function deleteAccommodation(id) {

    if (
        !confirm(
            "Delete this accommodation?"
        )
    ) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/accommodations/${id}`,
            {
                method: "DELETE",

                headers: authHeaders()
            }
        );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.detail ||
                "Delete failed"
            );
        }


        loadAccommodations();


    } catch (error) {

        alert(error.message);

    }
}


// ==========================================
// TRANSPORTATION
// ==========================================

function showTransportationForm() {

    document.getElementById(
        "transportationForm"
    ).style.display = "block";
}


function hideTransportationForm() {

    document.getElementById(
        "transportationForm"
    ).style.display = "none";
}


async function addTransportation() {

    const data = {

        type:
            document.getElementById(
                "transportationType"
            ).value,

        provider:
            document.getElementById(
                "transportationProvider"
            ).value.trim(),

        source:
            document.getElementById(
                "transportationSource"
            ).value.trim(),

        destination:
            document.getElementById(
                "transportationDestination"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "transportationPrice"
                ).value
            ),

        departureTime:
            document.getElementById(
                "transportationDeparture"
            ).value,

        arrivalTime:
            document.getElementById(
                "transportationArrival"
            ).value

    };


    if (
        !data.provider ||
        !data.source ||
        !data.destination
    ) {

        alert(
            "Please fill all transportation fields."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to add transportation"
            );
        }


        alert(
            "Transportation added successfully."
        );


        hideTransportationForm();


        document.getElementById(
            "transportationProvider"
        ).value = "";

        document.getElementById(
            "transportationSource"
        ).value = "";

        document.getElementById(
            "transportationDestination"
        ).value = "";

        document.getElementById(
            "transportationPrice"
        ).value = "";

        document.getElementById(
            "transportationDeparture"
        ).value = "";

        document.getElementById(
            "transportationArrival"
        ).value = "";


        loadTransportation();


    } catch (error) {

        alert(error.message);

    }
}


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
                <div class="admin-empty">
                    No transportation available.
                </div>
            `;

            return;
        }


        container.innerHTML =
            transportation.map(item => {

                return `

                    <div class="admin-item">

                        <div class="admin-item-content">

                            <span class="badge">
                                ${item.type}
                            </span>

                            <h3>
                                ${item.provider}
                            </h3>

                            <p>
                                📍
                                ${item.source}
                                →
                                ${item.destination}
                            </p>

                            <p>
                                🕐
                                ${item.departure_time || "N/A"}
                                →
                                ${item.arrival_time || "N/A"}
                            </p>

                            <p>
                                💰
                                ₹${Number(
                                    item.price || 0
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>


                        <div class="admin-actions">

                            <button
                                class="admin-edit-btn"
                                onclick="editTransportation(${item.id})"
                            >
                                Edit
                            </button>


                            <button
                                class="admin-delete-btn"
                                onclick="deleteTransportation(${item.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="admin-empty">
                Failed to load transportation.
            </div>
        `;
    }
}


// ==========================================
// EDIT TRANSPORTATION
// ==========================================

async function editTransportation(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/${id}`
        );


        const item =
            await response.json();


        if (!response.ok) {

            throw new Error(
                item.detail ||
                "Failed to load transportation"
            );
        }


        document.getElementById(
            "transportationType"
        ).value =
            item.type || "Flight";


        document.getElementById(
            "transportationProvider"
        ).value =
            item.provider || "";


        document.getElementById(
            "transportationSource"
        ).value =
            item.source || "";


        document.getElementById(
            "transportationDestination"
        ).value =
            item.destination || "";


        document.getElementById(
            "transportationPrice"
        ).value =
            item.price || 0;


        document.getElementById(
            "transportationDeparture"
        ).value =
            item.departure_time || "";


        document.getElementById(
            "transportationArrival"
        ).value =
            item.arrival_time || "";


        showTransportationForm();


        const form =
            document.getElementById(
                "transportationForm"
            );


        form.dataset.editingId = id;


        const button =
            form.querySelector(
                ".admin-add-btn"
            );


        button.textContent =
            "Update Transportation";


        button.onclick =
            function () {

                updateTransportation(id);

            };


    } catch (error) {

        alert(error.message);

    }
}


// ==========================================
// UPDATE TRANSPORTATION
// ==========================================

async function updateTransportation(id) {

    const data = {

        type:
            document.getElementById(
                "transportationType"
            ).value,

        provider:
            document.getElementById(
                "transportationProvider"
            ).value.trim(),

        source:
            document.getElementById(
                "transportationSource"
            ).value.trim(),

        destination:
            document.getElementById(
                "transportationDestination"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "transportationPrice"
                ).value
            ),

        departureTime:
            document.getElementById(
                "transportationDeparture"
            ).value,

        arrivalTime:
            document.getElementById(
                "transportationArrival"
            ).value

    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/${id}`,
            {
                method: "PUT",

                headers: authHeaders(),

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Update failed"
            );
        }


        alert(
            "Transportation updated successfully."
        );


        hideTransportationForm();


        resetTransportationForm();


        loadTransportation();


    } catch (error) {

        alert(error.message);

    }
}


// ==========================================
// RESET TRANSPORTATION FORM
// ==========================================

function resetTransportationForm() {

    document.getElementById(
        "transportationProvider"
    ).value = "";

    document.getElementById(
        "transportationSource"
    ).value = "";

    document.getElementById(
        "transportationDestination"
    ).value = "";

    document.getElementById(
        "transportationPrice"
    ).value = "";

    document.getElementById(
        "transportationDeparture"
    ).value = "";

    document.getElementById(
        "transportationArrival"
    ).value = "";


    const form =
        document.getElementById(
            "transportationForm"
        );


    const button =
        form.querySelector(
            ".admin-add-btn"
        );


    button.textContent =
        "Save Transportation";


    button.onclick =
        addTransportation;
}


// ==========================================
// DELETE TRANSPORTATION
// ==========================================

async function deleteTransportation(id) {

    if (
        !confirm(
            "Delete this transportation?"
        )
    ) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation/${id}`,
            {
                method: "DELETE",

                headers: authHeaders()
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Delete failed"
            );
        }


        alert(
            "Transportation deleted successfully."
        );


        loadTransportation();


    } catch (error) {

        alert(error.message);

    }
}


// ==========================================
// PACKAGES
// ==========================================

function showPackageForm() {

    document.getElementById(
        "packageForm"
    ).style.display = "block";
}


async function addPackage() {

    const data = {

        packageName:
            document.getElementById(
                "packageName"
            ).value,

        destination:
            document.getElementById(
                "packageDestination"
            ).value,

        duration:
            Number(
                document.getElementById(
                    "packageDuration"
                ).value
            ),

        price:
            Number(
                document.getElementById(
                    "packagePrice"
                ).value
            ),

        hotel:
            document.getElementById(
                "packageHotel"
            ).value,

        activities:
            document.getElementById(
                "packageActivities"
            ).value,

        itinerary:
            document.getElementById(
                "packageItinerary"
            ).value,

        availableSeats:
            Number(
                document.getElementById(
                    "packageSeats"
                ).value
            )

    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/packages/`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify(data)
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to add package"
            );
        }


        alert(
            "Package added successfully."
        );


        document.getElementById(
            "packageForm"
        ).style.display = "none";


        loadPackages();


    } catch (error) {

        alert(error.message);

    }
}


async function loadPackages() {

    const container =
        document.getElementById(
            "packageList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/packages/`
        );


        const packages =
            await response.json();


        container.innerHTML =
            packages.map(item => {

                return `

                    <div class="admin-item">

                        <div>

                            <h3>
                                ${item.package_name}
                            </h3>

                            <p>
                                ${item.destination}
                            </p>

                            <p>
                                ${item.duration} Days
                            </p>

                            <p>
                                ₹${Number(
                                    item.price || 0
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// BOOKINGS
// ==========================================

async function loadBookings() {

    const container =
        document.getElementById(
            "bookingList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/`,
            {
                headers: authHeaders()
            }
        );


        const bookings =
            await response.json();


        if (
            !bookings ||
            bookings.length === 0
        ) {

            container.innerHTML = `
                <div class="admin-empty">
                    No bookings found.
                </div>
            `;

            return;
        }


        container.innerHTML =
            bookings.map(item => {

                return `

                    <div class="admin-item">

                        <div>

                            <h3>
                                Booking #${item.id}
                            </h3>

                            <p>
                                User ID:
                                ${item.user_id}
                            </p>

                            <p>
                                Travellers:
                                ${item.number_of_travellers}
                            </p>

                            <p>
                                Total:
                                ₹${Number(
                                    item.total_amount || 0
                                ).toLocaleString("en-IN")}
                            </p>

                            <p>
                                Status:
                                ${item.status}
                            </p>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// TRANSPORTATION BOOKINGS
// ==========================================

async function loadTransportationBookings() {

    const container =
        document.getElementById(
            "transportationBookingList"
        );


    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/transportation-bookings/`,
            {
                headers: authHeaders()
            }
        );


        const bookings =
            await response.json();


        if (!response.ok) {

            throw new Error(
                bookings.detail ||
                "Failed to load transportation bookings"
            );
        }


        if (
            !bookings ||
            bookings.length === 0
        ) {

            container.innerHTML = `
                <div class="admin-empty">
                    No transportation bookings found.
                </div>
            `;

            return;
        }


        container.innerHTML =
            bookings.map(item => {

                return `

                    <div class="admin-item">

                        <div class="admin-item-content">

                            <span class="badge">
                                ${item.status}
                            </span>

                            <h3>
                                Booking #${item.id}
                            </h3>

                            <p>
                                User ID:
                                ${item.userId}
                            </p>

                            <p>
                                ${item.provider}
                            </p>

                            <p>
                                📍
                                ${item.source}
                                →
                                ${item.destination}
                            </p>

                            <p>
                                👥 Travellers:
                                ${item.numberOfTravellers}
                            </p>

                            <p>
                                💰 Total:
                                ₹${Number(
                                    item.totalAmount || 0
                                ).toLocaleString("en-IN")}
                            </p>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="admin-empty">
                Failed to load transportation bookings.
            </div>
        `;
    }
}