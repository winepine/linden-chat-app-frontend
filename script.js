let uid1 = 125,
  uid2 = 123;

const fetchMessages = async () => {
  const response = await fetch(
    `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/messages?uid1=${uid1}&uid2=${uid2}`
  );
  const { items } = await response.json();
  const msgs = document.getElementById("messages");
  msgs.innerHTML = "";
  items.forEach(item => {
    const msgBox = document.createElement("div");
    if (item.sender === user) {
      msgBox.id = "left";
    } else {
      msgBox.id = "right";
    }
    msgBox.innerHTML = item.message;
    msgs.appendChild(msgBox);
  });
};
const sendMessage = async () => {
  const message = document.getElementById("message-text").value;
  document.getElementById("message-text").value = "";
  const response = await fetch(
    `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        uid1: uid1.toString(),
        uid2: uid2.toString(),
        message,
        sender: user,
      }),
    }
  );
  await response.json();
  console.log(response);
};
fetchMessages();
