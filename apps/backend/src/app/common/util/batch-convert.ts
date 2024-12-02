export const batchConvert = <Output, Input = unknown>(items: Input[], fn: (input: Input) => Output): Output[] => {
  const outputs: Output[] = [];

  for (const item of items) {
    outputs.push(fn(item));
  }

  return outputs;
};
