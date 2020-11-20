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

        // const rooms = await Chat.find();
        // if(rooms) {
        //     rooms.forEach(async room => {
        //         if(room.name === theRoom) {
        //             exist = true;
    
        //             room.chats.push(data);
        //             await room.save();
        //         }
        //     })
        // }

        // If in past we didnt have history chat for this room //
        // if(! exist) {
        //     let newChat = new Chat({
        //         name: theRoom,
        //         chats: [data],
        //     })
        //     await newChat.save();
        // }

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
        console.log("joinChat", `${data.theUser}:${data.roomToJoin}`, `${data.roomToJoin}:${data.theUser}`);
        socket.join(`${data.theUser}:${data.roomToJoin}`);
        socket.join(`${data.roomToJoin}:${data.theUser}`);

        // let roomData = [];
        // let usersInChat = {};
        // usersInChat.theUser = data.theUser;
        // usersInChat.secondUser = data.roomToJoin;

        // const rooms = await Chat.find();
        // rooms.forEach(room => {
        //     if(room.name === data.roomToJoin) {
        //         roomData = room.chats;
        //     }
        // })

        socket.emit('clearMsg');
        // socket.emit('historyCatchUp', roomData);
    })
})

module.exports = new chatController();