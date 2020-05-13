document.querySelector('body').classList.add('js-enabled')


const profileSidebar = document.querySelector('#profiles');

document.querySelector('header svg').addEventListener('click', () => {
    profileSidebar.classList.toggle('active');
});

const profiles = document.querySelectorAll('.profile');
for (let i of profiles) {
    i.addEventListener('click', () => {
        profileSidebar.classList.toggle('active');
    })
};

const messageTextfield = document.querySelector('#messageForm input[type=text]')

/* Send messages*/
document.querySelector('#messageForm button').addEventListener('click', (e) => {
    e.preventDefault();
    let msg = messageTextfield.value.trim();

    //replace & < > " to prevent creating html code
    msg = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    if (msg != undefined && msg.length > 0) {
        document.querySelector('#messages').innerHTML +=
            `
         <div class="message messageSend">
             <p>${msg}</p>
         </div>
         `;

        messageTextfield.value = '';
    }
});