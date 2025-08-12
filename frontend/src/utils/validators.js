export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
  return regex.test(password);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateUsername = (username) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
  return regex.test(username);
};

export const validateNumber = (name, value, integerOnly = false) =>  {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`${name} must be a number`);
    }
    if (integerOnly && !Number.isInteger(value)) {
        throw new Error(`${name} must be an integer`);
    }
};

export const validateRange = (minName, minValue, maxName, maxValue) => {
    if (minValue > maxValue) {
        throw new Error(`${minName} must be less than or equal to ${maxName}`);
    }
};
