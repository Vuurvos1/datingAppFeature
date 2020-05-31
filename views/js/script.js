console.log('js connected');

const msg = document.querySelector('#message');
const sendMsg = document.querySelector('#sendMessage');
const messageSection = document.querySelector('#messages');

const settings = {
  url: 'http://localhost:3000',
};

let socket = io(settings.url);

const searchRoom = window.location.search.slice(1).trim();
console.log(searchRoom);
socket.emit('joinRoom', searchRoom);

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

  socket.emit('message', data);
  msg.value = '';

  // let data = {
  //   message: msg.value,
  // };
});
