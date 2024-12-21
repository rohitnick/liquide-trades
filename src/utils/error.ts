export const throwValidatorError = (obj: any, errors: any) => {
    // Example errors object - https://github.com/typestack/class-validator#validation-errors
    const key = Object.keys(errors[0].constraints)[0];
    throw new Error(`${obj.constructor.name}: ${errors[0].constraints[key]}`);
};

