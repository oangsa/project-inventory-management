export default function passwordValidation(password: string): boolean {
   const specialChars = '@$!%*?&.';
   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

   return passwordRegex.test(password) && specialChars.split('').some(char => password.includes(char));
}
