interface ISkeltonLoader {
  state: boolean;
  setState: Function;
}

const skeltonLoader = (setState: Function) => {
  setTimeout(() => {
    setState(false);
  }, 700);
};

export default skeltonLoader;
