export class CurrencyHelper {
    private readonly usdToEurRate: number = 1.08;
    private readonly currencyKey = 'selectedCurrency';

    /*****************************************/
    /******** convertUsdToEur ****************/
    /*****************************************/
    convertUsdToEur(priceUSD: number): number {
        return priceUSD * this.usdToEurRate;
    }

    /*****************************************/
    /******** convertEurToUsd ****************/
    /*****************************************/
    convertEurToUsd(priceEUR: number): number {
        return priceEUR / this.usdToEurRate;
    }

    /*****************************************/
    /******** convertCurrency ****************/
    /*****************************************/
    convertCurrency(price: number, fromCurrency: 'USD' | 'EUR', toCurrency: 'USD' | 'EUR'): number {
        if (fromCurrency === 'USD' && toCurrency === 'EUR') {
            return this.convertUsdToEur(price);
        } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
            return this.convertEurToUsd(price);
        }
        return price;
    }

    /*****************************************/
    /******** retrieveSavedCurrency **********/
    /*****************************************/
    retrieveSavedCurrency(): 'USD' | 'EUR' {
        const savedCurrency = localStorage.getItem(this.currencyKey);
        return savedCurrency === 'EUR' ? 'EUR' : 'USD';
    }

    /*****************************************/
    /******** saveCurrency *******************/
    /*****************************************/
    saveCurrency(currency: 'USD' | 'EUR'): void {
        localStorage.setItem(this.currencyKey, currency);
    }
}
