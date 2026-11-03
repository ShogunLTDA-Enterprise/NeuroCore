document.addEventListener("DOMContentLoaded", () => {

    const chatForm = document.querySelector("chat-input-container");
    const messageField = document.querySelector(".chat-input");
    const messagesContainer = document.querySelector(".chat_messages");

    function sendMessage() {

        const text = messageField.value.trim();

        if (text === "") return;

        const newMessage = document.createElement("div");
        newMessage.classList.add("message-self");

        newMessage.textContent = text;

        messagesContainer.appendChild(newMessage);

        messageField.value = "";

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    chatForm.addEventListener("submit", function(event) {
        event.preventDefault();
        sendMessage();
    });

});