module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    "no-underscore-dangle": 0,
    "no-plusplus":0,//允许使用++，--
    'camelcase':0,//强制驼峰法命名
    "block-scoped-var": 0,//块语句中使用var
    "semi": 0,
    "no-tabs":"off",
    "no-nested-ternary": 0,//禁止使用嵌套的三目运算
    "no-param-reassign":0,
    "array-callback-return":0
  }
};
