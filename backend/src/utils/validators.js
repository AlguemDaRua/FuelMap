const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isPositiveNumber = (val) => {
  return !isNaN(val) && Number(val) > 0;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

module.exports = { isValidEmail, isPositiveNumber, sanitizeString };
