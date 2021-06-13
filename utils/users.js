const moment = require("moment");
const users = [];

/* Structuring the message  */
function formatMessage(msg, username, room, id) {
  return { msg, username, room, id, time: moment().format("h:mm a") };
}

/* Adding user to array and emitting it to client  */
function addUser(username, room, id) {
  user = {
    username,
    room,
    id,
    time: moment().format("h:mm a"),
  };
  users.push(user);

  return user;
}

/* Removing user From socket and emitting to client  */
function removeUser(id) {
  const index = users.findIndex((user) => {
    user.id === id;
  });
  return users.splice(index, 1)[0];
}

/* Getting users present in room */
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { formatMessage, addUser, removeUser, getRoomUsers };
