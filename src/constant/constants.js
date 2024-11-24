const mongooseIdRegex = /^[a-f\d]{24}$/i;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharacterRegex = /[@$!%*?&#]/;

const constants = {
    mongooseIdRegex,
    uppercaseRegex,
    lowercaseRegex,
    numberRegex,
    specialCharacterRegex,
};

export default constants;
