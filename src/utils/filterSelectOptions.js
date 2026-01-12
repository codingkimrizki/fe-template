export const filterOption = (input, option) => {
  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
