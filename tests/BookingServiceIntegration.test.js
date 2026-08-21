import { jest } from "@jest/globals";
import app from "../app.js";
import db from "../database.js";

import {
    registerGuest,
    registerHost,
    loginGuest,
    loginHost,
    createRandomListing,
    createRandomBooking,
    getRandomDateBetween
} from "./helpers.js";

let server;
let baseUrl;

beforeAll(async () => {

    // Assign a random port for testing.
    server = app.listen(0);

    const address = server.address();

    const {port}=address;

    // Just wanted to see what was here: {family: IPv4 or IPv6, address::, port:random_port}
    console.log("Address",address)

    // Test can assign any port to the server
    baseUrl = `http://localhost:${port}`;
});


afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
    await db.close();
});

test("should register a user host", async () => {
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

test("should fail registration if email is invalid",async()=>{

    const invalidUser={
        email:"emmanuel",
        password:"password12#",
        role:"HOST"
    }

    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(invalidUser)
    });

    const body=await response.json();

    expect(response.status).toBe(400);
    expect(body.errors[0].message).toBe("Invalid email address");
});

test("should fail registration if password is less than 8 chars",async()=>{

    const invalidUser={
        email:"emm@example.com",
        password:"passwo",
        role:"HOST"
    }

    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(invalidUser)
    });

    const body=await response.json();

    expect(response.status).toBe(400);
    expect(body.errors[0].message).toBe("Too small: expected string to have >=8 characters");
});


test("should register a user guest", async () => {
    const testUser = {
        email: `test-${crypto.randomUUID()}@example.com`,
        password: "password123",
        role: "GUEST"
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
    expect(body.role).toBe("GUEST");
});

test("should login user as guest",async()=>{
    const guest=await registerGuest(baseUrl);

    const token=await loginGuest(baseUrl,
        guest.email,
        guest.password);

    expect(token).not.toBeNull();
});


test("should login user as host",async()=>{
    const host=await registerHost(baseUrl);

    const token=await loginHost(baseUrl,
        host.email,
        host.password);

    expect(token).not.toBeNull();
});

test("should test host can create a listing", async () => {
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

test("should test guest cannot create a listing", async () => {
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

test("shoild test guest can create a booking", async () => {
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

test("should test host cannot create a booking", async () => {
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


test("should not allow overlapping bookings on the same listing",async()=>{
   const guest = await registerGuest(baseUrl);

    const token = await loginGuest(
        baseUrl,
        guest.email,
        guest.password
    );

    const listing = await createRandomListing(baseUrl);

    const testBooking1=createRandomBooking();

    const checkInOverlap=getRandomDateBetween(testBooking1.checkIn,testBooking1.checkOut);
    const date= new Date(checkInOverlap);

    const checkOut=date.setDate(date.getDate() + 5);

    const testBooking2={
        checkIn:checkInOverlap,
        checkOut:checkOut
    }

    const response = await fetch(
        `${baseUrl}/api/listings/${listing.id}/bookings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(testBooking1)
        }
    );

    const responseOverlap= await fetch(
        `${baseUrl}/api/listings/${listing.id}/bookings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(testBooking2)
        }
    );

    const body=await responseOverlap.json();

    expect(responseOverlap.status).toBe(409);
    expect(body.error).toBe("Listing is already booked for the selected dates");
});


test("should update listing",async()=>{

   const host=await registerHost(baseUrl);

   const token=await loginHost(baseUrl,host.email,host.password);

   //create new listin

   const testListing = {
        title: `Listing-${crypto.randomUUID()}`,
        location: `Location-${crypto.randomUUID()}`,
        description: `Description-${crypto.randomUUID()}`,
        pricePerNight: 100
    };

    // Create listing as host
    const response1= await fetch(`${baseUrl}/api/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(testListing)
    });

   const listing=await response1.json();


   const updatedListing={...listing,
                         description:"Description changed"}
 
   const response2= await fetch(`${baseUrl}/api/listings/${updatedListing.id}`,{
                            method:"PUT",
                            headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`
                                    },
                            body: JSON.stringify(updatedListing)
                        });

   
   const body=await response2.json();

   expect(response2.status).toBe(200);
   expect(body.description).toBe(updatedListing.description);

});
