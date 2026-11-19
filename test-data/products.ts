// The six products of Sauce Demo.
// The id is used in the data-test names of the buttons, for example add-to-cart-sauce-labs-backpack
export const PRODUCTS = {
  backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
  redTShirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
  },
};

// All six products in one list
export const ALL_PRODUCTS = Object.values(PRODUCTS);

// The tax rate we expect (confirm it in your first manual test)
export const TAX_RATE = 0.08;

// Calculates the item total, the tax and the total for a list of products
export function calculateTotals(products: { price: number }[]) {
  const round = (n: number) => Math.round(n * 100) / 100;

  const subtotal = round(products.reduce((sum, p) => sum + p.price, 0));
  const tax = round(subtotal * TAX_RATE);
  const total = round(subtotal + tax);

  return { subtotal, tax, total };
}
