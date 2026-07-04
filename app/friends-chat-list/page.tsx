import AmbientBackground from "@/components/AmbientBackground";
import ChatList from "./ChatList/ChatList";
import UserInfo from "./UserInfo/UserInfo";

function FriendsChatList() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Ambient background glow */}
      <AmbientBackground right_left="right" top_bottom="bottom" />
      <div>
        <UserInfo key={"user_info"} />
        <ChatList key={"chat_list"} />
      </div>
    </div>
  );
}
export default FriendsChatList;
