import { default as LoadingIcon } from './icons/Loading';
const Loading = (props) => {
  return (
    <div
      className={
        props.inline
          ? 'inline-block'
          : `z-50 fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center`
      }
    >
      <LoadingIcon />
    </div>
  );
};

export default Loading;
