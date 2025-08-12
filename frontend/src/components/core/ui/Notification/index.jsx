import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { clearError } from 'store/slices/authSlice';


const Notification = () => {
  const { error } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [
    error, 
    dispatch
  ]);

  if (!error) return null;

  return (
    <div className="notification error">
      {error}
    </div>
  );
};

export default Notification;
