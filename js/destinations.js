async function loadDestinations() {
    const container = document.getElementById("destinationList");

    try {
        const response = await fetch(`${API_BASE_URL}/destinations/`);

        if (!response.ok) {
            throw new Error("Failed to load destinations");
        }

        const destinations = await response.json();

        if (destinations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No destinations available</h3>
                    <p>Please check again later.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = destinations.map(destination => `
            <div class="travel-card">

                <div class="travel-card-content">
                    <span class="badge">
                        ${destination.category || "Travel"}
                    </span>

                    <h2>${destination.name}</h2>

                    <p>
                        📍 ${destination.state || ""}, 
                        ${destination.country || ""}
                    </p>

                    <p>
                        ${destination.description || "Explore this beautiful destination."}
                    </p>

                    <div class="card-info">
                        <strong>Average Budget</strong>
                        <span>₹${Number(destination.average_budget || 0).toLocaleString("en-IN")}</span>
                    </div>
                </div>

            </div>
        `).join("");

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <div class="error-message">
                <h3>Failed to fetch destinations</h3>
                <p>Make sure the TravelX backend is running.</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadDestinations);