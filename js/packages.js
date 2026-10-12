let allPackages = [];


document.addEventListener("DOMContentLoaded", async () => {

    requireLogin();

    await loadPackages();

    setupFilters();
});


async function loadPackages() {

    const container =
        document.getElementById("packageGrid");

    try {

        const response = await fetch(
            `${API_BASE_URL}/packages/`
        );

        if (!response.ok) {
            throw new Error("Unable to load packages");
        }

        allPackages = await response.json();

        populateDestinations();

        displayPackages(allPackages);

    } catch (error) {

        container.innerHTML =
            `<p class="error-message">${error.message}</p>`;
    }
}


function populateDestinations() {

    const select =
        document.getElementById("destinationFilter");

    const destinations =
        [...new Set(
            allPackages.map(
                item => item.destination
            )
        )];

    destinations.forEach(destination => {

        const option =
            document.createElement("option");

        option.value = destination;
        option.textContent = destination;

        select.appendChild(option);
    });
}


function displayPackages(packages) {

    const container =
        document.getElementById("packageGrid");

    if (packages.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No packages found</h3>
                <p>Try another search or destination.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = packages.map(package => `

        <div class="package-card">

            <div class="package-top">

                <span class="duration">
                    ${package.duration} Days
                </span>

                <span class="seat-count">
                    ${package.available_seats}
                    seats
                </span>

            </div>

            <h3>
                ${package.package_name}
            </h3>

            <p class="package-location">
                📍 ${package.destination}
            </p>

            <div class="package-info">

                <p>
                    <strong>Hotel:</strong>
                    ${package.hotel || "Included"}
                </p>

                <p>
                    <strong>Activities:</strong>
                    ${package.activities || "Various activities"}
                </p>

            </div>

            <div class="package-bottom">

                <strong class="price">
                    ₹${Number(package.price)
                        .toLocaleString("en-IN")}
                </strong>

                <a
                    href="booking.html?id=${package.id}"
                    class="primary-btn">
                    View & Book
                </a>

            </div>

        </div>

    `).join("");
}


function setupFilters() {

    const search =
        document.getElementById("searchInput");

    const filter =
        document.getElementById("destinationFilter");

    search.addEventListener("input", applyFilters);

    filter.addEventListener("change", applyFilters);
}


function applyFilters() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const destination =
        document.getElementById("destinationFilter")
            .value;

    const filtered =
        allPackages.filter(package => {

            const matchesSearch =
                package.package_name
                    .toLowerCase()
                    .includes(search) ||

                package.destination
                    .toLowerCase()
                    .includes(search);

            const matchesDestination =
                !destination ||
                package.destination === destination;

            return matchesSearch &&
                   matchesDestination;
        });

    displayPackages(filtered);
}