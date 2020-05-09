// const form = document.querySelector('');

const messageTextfield  = document.querySelector('#messageForm input[type=text]')



document.querySelector('#messageForm button').addEventListener('click', (e) => {
    e.preventDefault();
    let msg = messageTextfield.value;

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


