export class CurrencyHelper {
    private static readonly usdToEurRate: number = 1.08;
    private readonly currencyKey = 'selectedCurrency';

    /**
     * Convierte un precio en USD a EUR.
     * @param priceUSD El precio en USD.
     * @returns El precio en EUR.
     */
    static convertUsdToEur(priceUSD: number): number {
        return priceUSD * this.usdToEurRate;
    }

    /**
     * Convierte un precio en EUR a USD.
     * @param priceEUR El precio en EUR.
     * @returns El precio en USD.
     */
    static convertEurToUsd(priceEUR: number): number {
        return priceEUR / this.usdToEurRate;
    }

    /**
     * Convierte un precio de una moneda a otra.
     * @param price El precio a convertir.
     * @param fromCurrency La moneda de origen ('USD' o 'EUR').
     * @param toCurrency La moneda de destino ('USD' o 'EUR').
     * @returns El precio convertido.
     */
    static convertCurrency(price: number, fromCurrency: 'USD' | 'EUR', toCurrency: 'USD' | 'EUR'): number {
        if (fromCurrency === 'USD' && toCurrency === 'EUR') {
            return this.convertUsdToEur(price);
        } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
            return this.convertEurToUsd(price);
        }
        // Si las monedas son iguales, devuelve el precio sin cambios
        return price;
    }

    /**
   * Recupera la moneda guardada previamente del almacenamiento local.
   * @returns La moneda guardada ('USD' o 'EUR'), o 'USD' si no se ha guardado nada.
   */
    retrieveSavedCurrency(): 'USD' | 'EUR' {
        const savedCurrency = localStorage.getItem(this.currencyKey);
        // Devuelve la moneda guardada si existe, o 'USD' por defecto
        return savedCurrency === 'EUR' ? 'EUR' : 'USD';
    }

    /**
     * Guarda la moneda seleccionada en el almacenamiento local.
     * @param currency La moneda a guardar ('USD' o 'EUR').
     */
    saveCurrency(currency: 'USD' | 'EUR'): void {
        localStorage.setItem(this.currencyKey, currency);
    }
}
