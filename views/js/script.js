console.log('js connected');

const msg = document.querySelector('#message');
const sendMsg = document.querySelector('#sendMessage');
const messageSection = document.querySelector('#messages');

let socket = io(window.location.host);

messageSection.scrollTop = messageSection.scrollHeight;

// Incomming
socket.on('message', (data) => {
  console.log(data);

  messageSection.innerHTML += `
  <div class="message messageRecieve">
      <p>
          ${data.trim()}
      </p>
  </div>
  `;

  messageSection.scrollTop = messageSection.scrollHeight;
});

// Outgoing
sendMsg.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(msg.value.trim());

  let data = {
    message: msg.value.trim(),
  };

  messageSection.innerHTML += `
    <div class="message messageSend">
        <p>
            ${msg.value.trim()}
        </p>
    </div>
    `;

  messageSection.scrollTop = messageSection.scrollHeight;

  console.log('send data');
  socket.emit('message', data);
  msg.value = '';
});
