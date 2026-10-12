async function loadAccommodations() {

    const container =
        document.getElementById("accommodationList");

    try {

        const response = await fetch(
            `${API_BASE_URL}/accommodations/`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load accommodations"
            );
        }

        const accommodations =
            await response.json();

        if (accommodations.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No accommodations available
                    </h3>

                    <p>
                        Please check again later.
                    </p>

                </div>
            `;

            return;
        }

        container.innerHTML =
            accommodations.map(accommodation => `

            <div class="travel-card">

                <span class="badge">
                    ${accommodation.type || "Hotel"}
                </span>

                <h2>
                    ${accommodation.name}
                </h2>

                <p>
                    📍 ${accommodation.destination}
                </p>

                <p>
                    ⭐ ${accommodation.rating || "N/A"}
                </p>

                <p>
                    ${accommodation.facilities ||
                    "Facilities available"}
                </p>

                <div class="card-info">

                    <strong>
                        Price / Night
                    </strong>

                    <span>
                        ₹${Number(
                            accommodation.price_per_night || 0
                        ).toLocaleString("en-IN")}
                    </span>

                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error-message">

                <h3>
                    Failed to fetch accommodations
                </h3>

                <p>
                    Make sure the TravelX backend
                    is running.
                </p>

            </div>
        `;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadAccommodations
);