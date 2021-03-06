import io from 'socket.io-client';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://mouse-with-friends-api.now.sh';
const socket = io.connect(API_URL);
const mice = {};

socket.on('connect', () => {
    console.log('connected to the socket server!');
});

socket.on('mousemove', (event) => {
        let mouse = mice[event.id];
        if (!mouse) {
            const span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.color = 'white';
            span.textContent = '*.*';
            mice[event.id] = span;
            document.body.appendChild(span);
        }
    
        mouse.style.top = event.y + 'px';
        mouse.style.left = event.x + 'px';
});


socket.on('message-client-disconnect', (id) => {
    if(mice[id]) {
        document.body.removeChild(mice[id]);
    }
});



document.addEventListener('mousemove', (event) => {
    socket.emit('mousemove', {
        x: event.clientX,
        y: event.clientY
    });
});