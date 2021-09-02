const { useEffect } = require('react');

const useTitle = (title) => {
  useEffect(() => {
    const oldTitle = document.title;
    document.title = title;
    return () => (document.title = oldTitle);
  }, [title]);
};

export default useTitle;
