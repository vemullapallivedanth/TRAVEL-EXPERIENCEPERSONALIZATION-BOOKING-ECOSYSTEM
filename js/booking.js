let selectedPackage = null;


document.addEventListener("DOMContentLoaded", async () => {

    requireLogin();

    const params =
        new URLSearchParams(window.location.search);

    const packageId = params.get("id");

    if (!packageId) {

        document.getElementById("bookingContent").innerHTML = `
            <div class="empty-state">
                <h2>Package not selected</h2>
                <a href="packages.html"
                   class="primary-btn">
                   Browse Packages
                </a>
            </div>
        `;

        return;
    }

    await loadPackage(packageId);
});


async function loadPackage(id) {

    const container =
        document.getElementById("bookingContent");

    try {

        const response = await fetch(
            `${API_BASE_URL}/packages/${id}`
        );

        const packageData =
            await response.json();

        if (!response.ok) {
            throw new Error(
                packageData.detail ||
                "Package not found"
            );
        }

        selectedPackage = packageData;

        renderBooking(packageData);

    } catch (error) {

        container.innerHTML =
            `<p class="error-message">${error.message}</p>`;
    }
}


function renderBooking(packageData) {

    const container =
        document.getElementById("bookingContent");

    container.innerHTML = `

        <div class="booking-layout">

            <div class="booking-details">

                <p class="eyebrow">
                    TRAVEL PACKAGE
                </p>

                <h1>
                    ${packageData.package_name}
                </h1>

                <p class="package-location">
                    📍 ${packageData.destination}
                </p>

                <div class="detail-grid">

                    <div class="info-card">
                        <span>Duration</span>
                        <strong>
                            ${packageData.duration} Days
                        </strong>
                    </div>

                    <div class="info-card">
                        <span>Hotel</span>
                        <strong>
                            ${packageData.hotel || "Included"}
                        </strong>
                    </div>

                    <div class="info-card">
                        <span>Price / Traveller</span>
                        <strong>
                            ₹${Number(packageData.price)
                                .toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div class="info-card">
                        <span>Available Seats</span>
                        <strong>
                            ${packageData.available_seats}
                        </strong>
                    </div>

                </div>

                <div class="detail-box">

                    <h3>Activities</h3>

                    <p>
                        ${packageData.activities || "Not specified"}
                    </p>

                </div>

                <div class="detail-box">

                    <h3>Itinerary</h3>

                    <p>
                        ${packageData.itinerary || "Not specified"}
                    </p>

                </div>

            </div>


            <div class="booking-form-card">

                <h2>Confirm Your Booking</h2>

                <p>
                    Select the number of travellers.
                </p>

                <label>
                    Number of Travellers
                </label>

                <input
                    type="number"
                    id="travellers"
                    value="1"
                    min="1"
                    max="${packageData.available_seats}"
                    oninput="calculateTotal()"
                >

                <div class="total-box">

                    <span>Total Amount</span>

                    <strong id="totalAmount">
                        ₹${Number(packageData.price)
                            .toLocaleString("en-IN")}
                    </strong>

                </div>

                <button
                    onclick="confirmBooking()"
                    class="primary-btn full-btn">
                    Confirm Booking
                </button>

                <div id="bookingMessage"></div>

            </div>

        </div>
    `;
}


function calculateTotal() {

    const travellers =
        Number(
            document.getElementById("travellers").value
        ) || 1;

    const total =
        travellers * selectedPackage.price;

    document.getElementById("totalAmount")
        .textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


async function confirmBooking() {

    const travellers =
        Number(
            document.getElementById("travellers").value
        );

    const message =
        document.getElementById("bookingMessage");

    if (travellers <= 0) {

        message.innerHTML =
            `<p class="error-message">
                Enter a valid number of travellers.
            </p>`;

        return;
    }

    if (
        travellers >
        selectedPackage.available_seats
    ) {

        message.innerHTML =
            `<p class="error-message">
                Not enough seats available.
            </p>`;

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/`,
            {
                method: "POST",
                headers: authHeaders(),

                body: JSON.stringify({
                    packageId: selectedPackage.id,
                    numberOfTravellers: travellers
                })
            }
        );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail ||
                "Booking failed"
            );
        }

        message.innerHTML = `
            <div class="success-box">

                <h3>Booking Confirmed!</h3>

                <p>
                    Booking ID:
                    <strong>${result.bookingId}</strong>
                </p>

                <p>
                    Total:
                    <strong>
                        ₹${Number(result.totalAmount)
                            .toLocaleString("en-IN")}
                    </strong>
                </p>

                <a
                    href="dashboard.html"
                    class="primary-btn">
                    View My Bookings
                </a>

            </div>
        `;

    } catch (error) {

        message.innerHTML =
            `<p class="error-message">
                ${error.message}
            </p>`;
    }
}