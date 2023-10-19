// @flow

function foo(x) {
    if (x !== null && x !== undefined) {
      return x.toString();
    }
    return "default string";
  }
  