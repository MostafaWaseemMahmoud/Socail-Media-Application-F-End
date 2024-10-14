// API.js
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIxOTVmNGYyYy03OTgxLTQ1NjYtODM1Yi01NTBiMWY5YjIxM2IiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyODkxODk1MiwiZXhwIjoxODg2NzA2OTUyfQ.ZgZxNw7hOyU0pAc-rzz_Hpuden0PqqM7r_YiNg9K-aI";

// API call to create a meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  
  if (!res.ok) {
    console.error("Failed to create meeting:", res.statusText);
    throw new Error("Meeting creation failed");
  }

  const { roomId } = await res.json();
  console.log("Meeting created with ID:", roomId);
  return roomId;
};

