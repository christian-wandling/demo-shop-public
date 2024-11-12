export type DrawOptions = {
  pointer: {
    x: number;
    y: number;
  };
  border: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  line: {
    color: {
      light: number;
    };
  };
  text: {
    color: {
      darker: number;
      dark: number;
      light: number;
      lighter: number;
    };
    size: {
      tiny: number;
      smaller: number;
      small: number;
      default: number;
    };
    font: {
      default: 'Helvetica';
    };
  };
};
