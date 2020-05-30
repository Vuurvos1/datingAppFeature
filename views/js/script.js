console.log('js connected');
const settings = {
  url: 'http://localhost:3000',
};

let socket = io(settings.url);
// let socket = io();
// socket = ;

let searchRoom = window.location.search.slice(1).trim();
console.log(searchRoom);

socket.on('message', (data) => {
  console.log(data);
});
