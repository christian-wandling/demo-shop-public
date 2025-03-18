/**
 * Applies a conversion function to each item in an array and returns a new array of the results.
 *
 * @template Output - The type of the output elements
 * @template Input - The type of the input elements, defaults to unknown
 * @param {Input[]} items - The array of items to be converted
 * @param {function(Input): Output} fn - The conversion function to apply to each item
 * @returns {Output[]} A new array containing the results of applying the conversion function to each input item
 *
 * @example
 * // Convert an array of strings to numbers
 * const numbers = batchConvert(['1', '2', '3'], str => parseInt(str));
 *
 * @example
 * // Convert an array of objects to a different shape
 * const users = batchConvert(
 *   [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
 *   user => ({ userId: user.id, username: user.name })
 * );
 */
export const batchConvert = <Output, Input = unknown>(items: Input[], fn: (input: Input) => Output): Output[] => {
  const outputs: Output[] = [];

  for (const item of items) {
    outputs.push(fn(item));
  }

  return outputs;
};
