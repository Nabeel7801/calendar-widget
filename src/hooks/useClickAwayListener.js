import { useEffect, useRef } from 'react';

const useClickAwayListener = (handler, timeout=0) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setTimeout(handler, timeout);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler, timeout]);

  return ref;
};

export default useClickAwayListener;
