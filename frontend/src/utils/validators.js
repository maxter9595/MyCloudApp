/**
 * Validate a password. A valid password must 
 * contain at least one uppercase letter, at
 * least one digit, at least one special character, 
 * and must be at least 6 characters long.
 * 
 * @param {string} password - The 
 * password to be validated.
 * @returns {boolean} True if 
 * the password is valid, false 
 * otherwise.
 */
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
  return regex.test(password);
};

/**
 * Validate an email address. A valid email must
 * have a local part, an "@" symbol, and a domain 
 * part with a top-level domain, without any spaces.
 * 
 * @param {string} email - The 
 * email address to be validated.
 * @returns {boolean} True if the 
 * email is valid, false otherwise.
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate a username. A valid username must
 * be between 4 and 20 characters long, and must
 * start with a letter. It may contain only letters
 * and numbers.
 * 
 * @param {string} username - The
 * username to be validated.
 * @returns {boolean} True if the
 * username is valid, false otherwise.
 */
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
