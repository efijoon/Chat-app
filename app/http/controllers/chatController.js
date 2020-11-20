const controller = require('app/http/controllers/controller');
const Chat = require('../../models/Chat');
const User = require('../../models/user');
const { io } = require('../../index');

class chatController extends controller {

    async index(req, res, next) {
        try {
            const allUsers = await User.find().select('username email image');

            // Filtering the current user out of user list
            let users = allUsers.filter(user => user.email !== req.user.email);

            res.render('chat/chat', { title: 'گفتگو', users, layout: 'chat/chat' });

        } catch (err) {
            next(err)
        }
    } 
}

io.on('connection', async (socket) => {
    console.log('Connected...');

    socket.on('newMessage', async (data) => {
        let exist = false;
        let rooms = Object.keys(socket.rooms);

        // For inserting the message into database
        let nameArr = [];
        nameArr.push(rooms[1], rooms[2]);

        const databaseRooms = await Chat.find();
        if(databaseRooms) {
            databaseRooms.forEach(async room => {
                if(isEqArrays(room.name, nameArr)) {
                    exist = true;
    
                    room.chats.push(data);
                    await room.save();
                }
            })
        }

        // If in past we didnt have history chat for this room //
        if(! exist) {
            let newChat = new Chat({
                name: nameArr,
                chats: [data],
            })
            await newChat.save();
        }

        // console.log("sendMessage to -->", `${rooms[1]}:${rooms[2]}`, `${rooms[2]}:${rooms[1]}`);
        io.to(rooms[1]).to(rooms[2]).emit('newMessage', data);
    })

    socket.on('roomJoin', async (data) => {
        // Leave from previous room if exist
        if(data.roomToLeave) {
            socket.leave(`${data.theUser}:${data.roomToLeave}`);
            socket.leave(`${data.roomToLeave}:${data.theUser}`);
        }

        // Join to new room
        let wayOne = `${data.theUser}:${data.roomToJoin}`;
        let wayTwo = `${data.roomToJoin}:${data.theUser}`;

        socket.join(wayOne);
        socket.join(wayTwo);

        // For loading the chat history
        let nameArr = [];
        nameArr.push(wayOne, wayTwo);

        let roomData = [];

        const rooms = await Chat.find();
        rooms.forEach(room => {
            if(isEqArrays(room.name, nameArr)) {
                roomData = room.chats;
            }
        });

        socket.emit('clearMsg');
        socket.emit('historyCatchUp', roomData);
    })
});

function inArray(array, el) {
  for ( var i = array.length; i--; ) {
    if ( array[i] === el ) return true;
  }
  return false;
}

function isEqArrays(arr1, arr2) {
  if ( arr1.length !== arr2.length ) {
    return false;
  }
  for ( var i = arr1.length; i--; ) {
    if ( !inArray( arr2, arr1[i] ) ) {
      return false;
    }
  }
  return true;
}

module.exports = new chatController();