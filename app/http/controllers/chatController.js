const controller = require('app/http/controllers/controller');
const Chat = require('../../models/Chat');
const User = require('../../models/user');
const { io } = require('../../index');

class chatController extends controller {

    async index(req, res, next) {
        try {
            const users = await User.find().select('username email image');

            res.render('chat/chat', { title: 'گفتگو', users, layout: 'chat/chat' });

        } catch (err) {
            next(err)
        }
    } 
}

io.on('connection', async (socket) => {
    console.log('Connected...');

    socket.on('newMessage', async (data) => {
        let exist;
        const theRoom = Object.keys(socket.rooms)[1];

        const rooms = await Chat.find();
        if(rooms) {
            rooms.forEach(async room => {
                if(room.name === theRoom) {
                    exist = true;
    
                    room.chats.push(data);
                    await room.save();
                }
            })
        }

        if(! exist) {
            let newChat = new Chat({
                name: theRoom,
                chats: [data],
            })
            await newChat.save();
        }

        io.to(theRoom).emit('newMessage', data);
    })

    socket.on('roomJoin', async (data) => {
        socket.leave(data.roomToLeave);
        socket.join(data.roomToJoin);

        socket.join(`${data.theUser}:${data.roomToJoin}`);
        socket.join(`${data.roomToJoin}:${data.theUser}`);

        let roomData = [];
        let usersInChat = {};
        usersInChat.theUser = data.theUser;
        usersInChat.secondUser = data.roomToJoin;

        const rooms = await Chat.find();
        rooms.forEach(room => {
            if(room.name === data.roomToJoin) {
                roomData = room.chats;
            }
        })

        socket.emit('clearMsg');
        socket.emit('historyCatchUp', roomData);
    })
})

module.exports = new chatController();