import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { clearError } from 'store/slices/authSlice';


/**
 * Notification component that displays error 
 * messages from the authentication state.
 * It automatically clears the error after 
 * 10 seconds using a timeout. Returns null 
 * if there is no error to display.
 */
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
