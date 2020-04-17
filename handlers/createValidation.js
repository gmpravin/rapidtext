const { check, validationResult } = require("express-validator");
// const ev from './node/express-validator';

const createValidationFor = route => {
  switch (route) {
    case "login":
      return [
        check("email")
          .isEmail()
          .withMessage("must be an email"),
        check("password")
          .not()
          .isEmpty()
          .isLength({ min: 8 })
          .withMessage("password required")
      ];

    case "register":
      return [
        check("name")
          .not()
          .isEmpty()
          .withMessage("name required"),
        check("email")
          .isEmail()
          .withMessage("must be an email"),
        check("password")
          .not()
          .isEmpty()
          .isLength({ min: 8 })
          .withMessage("Password required")
      ];

    case "dashboard":
      return [
        check("email")
          .isEmail()
          .withMessage("must be an email"),
        check("password")
          .not()
          .isEmpty()

          .withMessage("password required"),

        check("api")
          .not()
          .isEmpty()
          .withMessage("Api key required"),
        check("sid")
          .not()
          .isEmpty()

          .withMessage("Sid required")
      ];
    case "sms":
      return [
        check("from")
          .not()
          .isEmpty()
          .withMessage("from number required"),

        check("to")
          .not()
          .isEmpty()
          .withMessage("to number required"),

        check("bodyMessage")
          .not()
          .isEmpty()
          .withMessage("Message body required")
      ];

    // case "bulksms":
    //   return [
    //     check("from")
    //       .not()
    //       .isEmpty()
    //       .withMessage("to number required"),

    //     check("bodyMessage")
    //       .not()
    //       .isEmpty()
    //       .withMessage("Message body required")
    //   ];

    default:
      return [];
  }
};

module.exports = createValidationFor;
