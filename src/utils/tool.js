export const tool = {
  calculateTotalAmount(data, key = 'amount') {
    return data.reduce((total, item) => total + item[key], 0);
  },
  formatMoney(number) {
    return new Intl.NumberFormat().format(number);
  },
};
