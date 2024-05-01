export default function displayPriceLevel(priceLevel: number): string {
    let price = '';
    for (let i = 0; i < priceLevel; i++) {
      price += '$';
    }
    return price;
  }