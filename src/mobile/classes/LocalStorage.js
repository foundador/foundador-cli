class LocalStorage {
  key(n) {
    return window.localStorage ? window.localStorage.key(n) : null;
  }
  getItem(key) {
    return window.localStorage ? window.localStorage.getItem(key) : null;
  }
  getAll() {
    var returnObj = {};
    if(window.localStorage) {
      let length = window.localStorage.length;
      while(length--) {
        returnObj[window.localStorage.key(length)] = window.localStorage.getItem(window.localStorage.key(length));
      }
    }
    return returnObj;
  }
  setItem(key,value) {
    return window.localStorage ? window.localStorage.setItem(key,value) : null;
  }
  removeItem(key) {
    return window.localStorage ? window.localStorage.removeItem(key) : null;
  }
  clear() {
    return window.localStorage ? window.localStorage.clear() : null;
  }
}

export default LocalStorage;
