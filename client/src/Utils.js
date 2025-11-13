export const validateEmail = (email) => {
    return email !== undefined && String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePassword = (password) => password !== undefined && password.length >= 5;

export const validateName = (name) => name !== undefined && name.length >= 3;

export const validatePrice = (price) => !isNaN(parseInt(price)) && parseInt(price) >= 0

export const validateBirthDate = (birthDate) => birthDate !== undefined

export const validateGender = (gender) => gender !== undefined && gender.length !== 0