import Cams from './Cams';
import Chat from './Chat';

const Telephone = (props) => {
  let { socket } = props;
  return (
    <>
      <Cams />
      <Chat socket={socket} />
    </>
  );
};

export default Telephone;
