export const batchConvert = <Output, Input = unknown>(orders: Input[], fn: (input: Input) => Output): Output[] => {
  const outputs: Output[] = [];

  for (let i = 0; i < orders.length; i++) {
    outputs.push(fn(orders[i]));
  }

  return outputs;
};
