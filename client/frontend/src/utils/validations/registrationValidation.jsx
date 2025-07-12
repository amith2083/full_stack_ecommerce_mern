
export const validateRegisterForm = ({ name, email, password }) => {
  const nameTrimmed = name.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (nameTrimmed.length < 3) {
    return "Name must be at least 3 characters long.";
  }

  if (!emailRegex.test(email)) {
    return "Enter a valid email address.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be at least 6 characters and contain letters and numbers.";
  }

  return null; // No errors
};
