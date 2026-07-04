// import Settings from "./Settigns/Settings";
import UserDetail from "./UserDetail/UserDetail";

function ChatDetails() {
  return (
    <div className="flex flex-1 h-full w-full flex-col border-l border-white/10 text-white">
      <UserDetail />
      {/* <Settings /> */}
    </div>
  );
}
export default ChatDetails;
