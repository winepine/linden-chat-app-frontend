let uuid = 125;
let AllChats = [];
let selectedId;
let selectedChat;
let ourUser;
function formatTimeDifference(timeDifference) {
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));

  if (seconds < 60) {
    return seconds + (seconds === 1 ? " second ago" : " seconds ago");
  } else if (minutes < 60) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  }
}
const switchChats = chatId => {
  if (selectedId) {
    document.getElementById(selectedId).classList.remove("message-active");
  }
  selectedId = chatId.id;
  document.getElementById(selectedId).classList.add("message-active");
  console.log(chatId.id);
  const chat = AllChats.find(chat => chat.id === chatId.id);
  selectedChat = chat;
  ourUser = chat.uid1 === uuid ? "uid1" : "uid2";
  document.getElementById("chat-user").innerText = chat[ourUser];

  const messagesContainer = document.getElementById("messages-chat");
  messagesContainer.innerHTML = "";

  chat.messages.forEach((message, idx) => {
    let messageBox;
    let timeAgo = message.timeStamp;
    const givenDate = new Date(timeAgo);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate - givenDate;
    const timeDifferenceString = formatTimeDifference(timeDifferenceMs);
    if (message.sender === ourUser) {
      messageBox = `
        <div class="message">
          <div
            class="photo"
            style="
              background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);
            "
          ></div>
          <p class="text">${message.message}</p>
        </div>
        `;
      if (
        chat.messages[idx + 1] &&
        chat.messages[idx + 1].sender !== message.sender
      ) {
        messageBox += `
              <p class="time">${timeDifferenceString}</p>
      `;
      }
    } else {
      messageBox = `
        <div class="message text-only">
          <div class="response">
            <p class="text">${message.message}</p>
          </div>
        </div>
        `;
      if (
        chat.messages[idx + 1] &&
        chat.messages[idx + 1].sender !== message.sender
      ) {
        messageBox += `
              <p class="response-time time">${timeDifferenceString}</p>
      `;
      }
    }
    messagesContainer.innerHTML += messageBox;
  });
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
};
const getChats = async () => {
  const chats = await fetch(
    `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/chats?uid=${uuid}`
  );
  const data = await chats.json();
  console.log(data);
  const responses = await Promise.all(
    data.map(chat =>
      fetch(
        `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/messages?uid1=${chat.uid1}&uid2=${chat.uid2}`
      )
    )
  );
  const jsons = await Promise.all(responses.map(res => res.json()));
  jsons.forEach((json, i) => {
    AllChats = [
      ...AllChats,
      {
        uid1: data[i].uid1,
        uid2: data[i].uid2,
        messages: json.items,
        id: data[i].id,
      },
    ];
  });
  console.log({ AllChats });
  const dicussionsContainer = document.getElementById("discussions");
  dicussionsContainer.innerHTML = `
  <div class="discussion search">
    <div class="searchbar">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search..." />
    </div>
  </div>
  `;
  AllChats.forEach(chat => {
    let user = chat.uid1 == uuid ? chat.uid2 : chat.uid1;
    const lastMessage = chat.messages[chat.messages.length - 1].message;
    let timeAgo = chat.messages[chat.messages.length - 1].timeStamp;
    const givenDate = new Date(timeAgo);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate - givenDate;
    const timeDifferenceString = formatTimeDifference(timeDifferenceMs);
    const chatContainer = `
    <div class="discussion" id=${chat.id} onclick="(()=>switchChats(${chat.id}))();">
        <div
          class="photo"
          style="
            background-image: url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80);
          "
        >
          <div class="online"></div>
        </div>
        <div class="desc-contact">
          <p class="name">${user}</p>
          <p class="message">${lastMessage}</p>
        </div>
        <div class="timer">${timeDifferenceString}</div>
    </div>
    `;
    dicussionsContainer.innerHTML += chatContainer;
  });
};
const sendMessage = async () => {
  if (!selectedChat) return alert("Please select a chat");
  const message = document.getElementById("message-text").value;
  document.getElementById("message-text").value = "";
  const response = await fetch(
    `https://ujh4bgcxhwiut7fpbekpov5n640manpc.lambda-url.us-east-1.on.aws/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        uid1: selectedChat.uid1.toString(),
        uid2: selectedChat.uid2.toString(),
        message,
        sender: ourUser,
      }),
    }
  );
  await response.json();
  console.log(response);
};
const init = async () => {
  await getChats();
};
init();
