const Chat = (props) => {
  let { socket } = props;
  return (
    <>
      <div>Chat</div>
      <input className="border-2 border-purple-800" type="text" />
    </>
  );
};

export default Chat;
