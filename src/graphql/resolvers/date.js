const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const dayjs = require("dayjs");

module.exports = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return dayjs(value);
    },
    serialize(value) {
      return dayjs(value).format("MM/DD/YYYY"); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};
