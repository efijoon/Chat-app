const socket = io('http://localhost:3000');

const chatbox = $('.messages > ul');

socket.on('newMessage', (data) => {

	if(socket.id == data.id) {
		chatbox.append(`
		<li class="replies"> 
			<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
			<p><span style="font-size: 10px;color: red;">${data.senderName}</span> <br> ${data.msg} </p>
		</li>
		`)
	} else {
		chatbox.append(`
		<li class="sent"> 
			<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
			<p><span style="font-size: 10px;color: red;">${data.senderName}</span> <br> ${data.msg} </p>
		</li>
		`)
	}

	const messages = document.getElementById('messagesBox');
	messages.scroll(10, messages.scrollHeight);
});

let roomToJoin;

function sendMessage() {
	let msg = $('#textbox').val();
	let senderName = $('#sender-name').val();
	console.log(senderName);
	if(msg == '') return;

	socket.emit('newMessage', { msg, senderName });
	$('#textbox').val('');
}

$('#msgSender').click(function (e) {
	sendMessage();
})

$(window).on('keydown', function(e) {
	if (e.which == 13) {
		sendMessage();
	}
});

const contacts = document.getElementsByClassName('contact');
Array.from(contacts).forEach(contact => {
	contact.addEventListener('click', function(e) {

		Array.from(contacts).forEach(c => {
			if(c.classList.value.includes('active')) c.classList.remove('active'); 
		})

		if(contact.classList.value.includes('active')) {
			contact.classList.remove('active');
		} else {
			contact.classList.add('active');
		}

		let headerName = document.getElementById('header-name');
		let headerImage = document.getElementById('header-image');

		let pName = $(contact).children().children().children()[0];
		roomToJoin = $(contact).children().children().children()[1].innerText;
		let imgElem = $(contact).children().children()[1];
		let roomToLeaveInput = document.getElementById('theRoom');
		let roomToLeave = roomToLeaveInput.value;

		headerImage.style.display = 'block';
		headerName.style.display = 'block';
		let img = imgElem.getAttribute('src');

		let username = pName.innerText;
		
		headerName.innerText = username;
		headerImage.src = img;

		// Send room Info ...
		let theUser = $('#sender').val();
		socket.emit('roomJoin', { roomToJoin, roomToLeave, theUser });

		// Change the previouse room name
		roomToLeaveInput.value = roomToJoin;
	})
})

socket.on('clearMsg', function () {
	$(chatbox).empty();
})

socket.on('historyCatchUp', function (data) {
	buildChat(data);
	$(chatbox).innerHTML = data;
})

function buildChat(data) {
	const currentUser = document.getElementById('sender-name').value;

	data.forEach(chat => {
		if(currentUser == chat.senderName) {
			chatbox.append(`
			<li class="replies"> 
				<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
				<p><span style="font-size: 10px;color: red;">${chat.senderName}</span> <br> ${chat.msg} </p>
			</li>
			`)
		} else {
			chatbox.append(`
			<li class="sent"> 
				<img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
				<p><span style="font-size: 10px;color: red;">${chat.senderName}</span> <br> ${chat.msg} </p>
			</li>
			`)
		}
	})
}