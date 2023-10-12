function getRandomInt(min = 1, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class faker {
  get internet() {
    return {
      emailAddress: () => `test${getRandomInt()}@gmail.com`,
      userName: () => `test${getRandomInt()}`,
      password: () => `12345${getRandomInt()}`,
      accountNumber: () => `${getRandomInt(10, 13)}`,
      identityNumber: () => `${getRandomInt(15, 16)}`,
    };
  }
}
export const fakerData = new faker();
