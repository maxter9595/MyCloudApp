import {
  validatePassword,
  validateEmail,
  validateUsername,
  validateNumber,
  validateRange
} from 'utils/validators';

describe('Validators', () => {
  describe('validatePassword', () => {
    it('should validate correct passwords', () => {
      expect(validatePassword('Password1!')).toBe(true);
      expect(validatePassword('Secure123@')).toBe(true);
    });

    it('should reject passwords without uppercase', () => {
      expect(validatePassword('password1!')).toBe(false);
    });

    it('should reject passwords without digits', () => {
      expect(validatePassword('Password!')).toBe(false);
    });

    it('should reject passwords without special chars', () => {
      expect(validatePassword('Password1')).toBe(false);
    });

    it('should reject short passwords', () => {
      expect(validatePassword('Pwd1!')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('should reject emails without @', () => {
      expect(validateEmail('test.example.com')).toBe(false);
    });

    it('should reject emails without domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('UserName')).toBe(true);
    });

    it('should reject usernames starting with digit', () => {
      expect(validateUsername('1username')).toBe(false);
    });

    it('should reject short usernames', () => {
      expect(validateUsername('usr')).toBe(false);
    });

    it('should reject long usernames', () => {
      expect(validateUsername('thisusernameistoolong123')).toBe(false);
    });

    it('should reject usernames with special chars', () => {
      expect(validateUsername('user@name')).toBe(false);
    });
  });

  describe('validateNumber', () => {
    it('should validate correct numbers', () => {
      expect(() => validateNumber('test', 42)).not.toThrow();
      expect(() => validateNumber('test', 3.14)).not.toThrow();
    });

    it('should throw error for non-numbers', () => {
      expect(() => validateNumber('test', 'not a number')).toThrow('test must be a number');
      expect(() => validateNumber('test', NaN)).toThrow('test must be a number');
      expect(() => validateNumber('test', Infinity)).toThrow('test must be a number');
    });

    it('should validate integers when integerOnly=true', () => {
      expect(() => validateNumber('test', 42, true)).not.toThrow();
      expect(() => validateNumber('test', 3.14, true)).toThrow('test must be an integer');
    });
  });

  describe('validateRange', () => {
    it('should validate correct ranges', () => {
      expect(() => validateRange('min', 1, 'max', 10)).not.toThrow();
      expect(() => validateRange('min', 5, 'max', 5)).not.toThrow();
    });

    it('should throw error when min > max', () => {
      expect(() => validateRange('min', 10, 'max', 1))
        .toThrow('min must be less than or equal to max');
    });
  });
});
