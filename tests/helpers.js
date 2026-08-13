export async function loginHost(baseUrl, email, password) {
    return loginUser(baseUrl, email, password);
}

export async function loginGuest(baseUrl, email, password) {
    return loginUser(baseUrl, email, password);
}

export async function loginUser(baseUrl, email, password = "password123") {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    return body.token;
}

export async function registerUser(baseUrl, role) {
    const email = `${role.toLowerCase()}-${crypto.randomUUID()}@example.com`;
    const password = "password123";

    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            role
        })
    });

    expect(response.status).toBe(201);

    return {
        email,
        password,
        user: await response.json()
    };
}

export async function registerHost(baseUrl) {
    return registerUser(baseUrl, "HOST");
}

export async function registerGuest(baseUrl) {
    return registerUser(baseUrl, "GUEST");
}

export async function createRandomListing(baseUrl) {
    // Register host
    const host = await registerHost(baseUrl);

    // Login host
    const hostToken = await loginHost(
        baseUrl,
        host.email,
        host.password
    );

    const listing = {
        title: `Listing-${crypto.randomUUID()}`,
        location: `Location-${crypto.randomUUID()}`,
        description: `Description-${crypto.randomUUID()}`,
        pricePerNight: 100
    };

    // Create listing as host
    const response = await fetch(`${baseUrl}/api/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hostToken}`
        },
        body: JSON.stringify(listing)
    });

    expect(response.status).toBe(201);

    const body = await response.json();

    // "Logout" discard the JWT
    return body;
}

export function createRandomBooking() {
    const checkInOffset = Math.floor(Math.random() * 30) + 1;
    const stayLength = Math.floor(Math.random() * 7) + 1;

    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + checkInOffset);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + stayLength);

    return {
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0]
    };
}

export function getRandomDateBetween(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const daysBetween = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    const randomDays = Math.floor(Math.random() * (daysBetween + 1));

    const result = new Date(startDate);
    result.setDate(result.getDate() + randomDays);

    return result;
}