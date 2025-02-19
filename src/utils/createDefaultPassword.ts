export function createDefaultPassword(name: string): string {
  const specialCharacters = '!@#$%^&*';
  const suffix = '12345678';
  const randomSpecialChar = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  const password = (name + randomSpecialChar + suffix).slice(0, 8);
  return password;
}