/* import { removeUser, roomUsers } from "utils/users";
 */
var socket = io();

/* Getting username and room from query string in url  */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
/*  Setting Date and room name  */
document.getElementById("date").innerHTML = new Date().toLocaleDateString(
  "en-US"
);
$("#room-heading").html(`<strong>${room} Room </strong>`);

/* Emitting join event and appending message to  update-box */
socket.emit("join", { username, room });
socket.on("join", (user) => {
  localStorage.clear();
  localStorage.setItem("userID", user.id);
  $(".chat-update-box-updates").append(
    $(`<div class="message-update" style="margin: 10px auto ;">
    <p style='font-size:10px;'>Admin ${user.time}</p>
     ${user.username} has joined the chat 
    </div>`)
  );
});

/* Emitting leave event and appending message to update-box */
socket.on("leave-chat", (user) => {
  $(".chat-update-box-updates").append(
    $(`<div class="message-update" style="margin: 10px auto">
    <p style='font-size:10px;'>Admin ${user.time}</p>
     ${user.username} left the chat 
    </div>`)
  );
});

/* emitting user typed message to server */
$("#chat-message").submit((e) => {
  e.preventDefault();
  var message = $("#message").val();
  if (message.length != 0) {
    socket.emit("message", { message, username, room });
    $("#message").val("");
    $("#message").focus();
  } else {
    return;
  }
});
y;
/* Appending message to chat-box */
socket.on("message", (item) => {
  console.log(item);
  if (item.username === username) {
    $(".messages-container").append(
      $(`<div id='msg1' class="message-update messages right ">
      ${item.msg}
      <p style='font-size:10px;'>${item.username} ${item.time}</p>
      </div>`)
    );
  } else {
    $(".messages-container").append(
      $(`<div id='msg1' class="message-update messages left ">
      ${item.msg}
    <p style='font-size:10px;'>${item.username} ${item.time}</p>

    </div>`)
    );
  }
  /*Setting  Scroll Down  */
  document.querySelector(".messages-container").scrollTop =
    document.querySelector(".messages-container").scrollHeight;
});

/* Updating room Users */
socket.on("roomUser", (userList) => {
  displayRoomUsers(userList);
});

/* Mapping usernames to show users present */
function displayRoomUsers(userList) {
  $(".users-list").html(
    `${userList.map(
      (user) => `
   ${user.username}
 `
    )}`
  );
}
