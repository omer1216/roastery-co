const response = await fetch("http://localhost:3000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "two flat whites please",
    history: [],
    cart: [],
  }),
});

console.log(JSON.stringify(await response.json(), null, 2));