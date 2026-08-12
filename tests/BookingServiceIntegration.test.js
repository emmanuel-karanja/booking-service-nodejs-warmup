import { jest } from "@jest/globals";
import app from "../app.js";
import db from "../database.js";

import {
    registerGuest,
    registerHost,
    loginGuest,
    loginHost,
    createRandomListing,
    createRandomBooking
} from "./helpers.js";

let server;
let baseUrl;

beforeAll(async () => {
    server = app.listen(0);

    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
});


afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    await db.close();
});

test("register a user", async () => {
    const testUser = {
        email: `test-${crypto.randomUUID()}@example.com`,
        password: "password123",
        role: "HOST"
    };

    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(testUser)
    });

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.email).toBe(testUser.email);
    expect(body.role).toBe("HOST");
});

test("host can create a listing", async () => {
    const host = await registerHost(baseUrl);

    const token = await loginHost(
        baseUrl,
        host.email,
        host.password
    );

    const testListing = {
        title: "Test Property",
        description: "Homesplus airbnb",
        location: "Naivasha",
        pricePerNight: 5000.00
    };

    const response = await fetch(`${baseUrl}/api/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(testListing)
    });

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.title).toBe("Test Property");
    expect(body.pricePerNight).toBe(5000.00);
});

test("guest cannot create a listing", async () => {
    const guest = await registerGuest(baseUrl);

    const token = await loginGuest(
        baseUrl,
        guest.email,
        guest.password
    );

    const testListing = {
        title: "Test Property",
        description: "Homesplus airbnb",
        location: "Naivasha",
        pricePerNight: 5000.00
    };

    const response = await fetch(`${baseUrl}/api/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(testListing)
    });

    expect(response.status).toBe(403);

    const body = await response.json();

    expect(body.error).toBe(
        "Action can only be performed by a Host user type."
    );
});

test("guest can create a booking", async () => {
    const guest = await registerGuest(baseUrl);

    const token = await loginGuest(
        baseUrl,
        guest.email,
        guest.password
    );

    const listing = await createRandomListing(baseUrl);

    const testBooking=createRandomBooking();

    const response = await fetch(
        `${baseUrl}/api/listings/${listing.id}/bookings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(testBooking)
        }
    );


    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.listingId).toBe(listing.id);
});

test("host cannot create a booking", async () => {
    const host = await registerHost(baseUrl);

    const token = await loginHost(
        baseUrl,
        host.email,
        host.password
    );

    const listing = await createRandomListing(baseUrl);

   // console.log(`Listing created for test: ${listing.id}`)

    const testBooking = createRandomBooking();

    const response = await fetch(
        `${baseUrl}/api/listings/${listing.id}/bookings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(testBooking)
        }
    );

    expect(response.status).toBe(403);

    const body = await response.json();

    expect(body.error).toBe(
        "Action can only be performed by a Guest user type."
    );
});