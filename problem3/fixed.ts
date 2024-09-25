// @ts-nocheck
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}
interface PriceData {
  currency: string;
  data: string;
  price: number;
}

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    // fetches data from the url
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }
    // data returns currency, data, price
    const data: PriceData[] = await response.json();
    const priceMap: Record<string, number> = {};
    for (const item of data) {
      priceMap[item.currency] = item.price;
    }
    return priceMap;
  }
}

interface Props extends BoxProps {
  // requires knowledge of BoxProps, and the props being passed down to it
}

// removed unnecessary line equating props
const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  // explicitly stated type of price as a record of string (currency) mapped to the USDC value (price)
  const [prices, setPrices] = useState<Record<string, number>>({});
  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then(setPrices)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // changed type of blockchain to string, as it's only being compared to strings
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // combined sorting and formatted balance functions and added useMemo for memoization

  const formattedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          balance.amount > 0 && getPriority(balance.blockchain) > -99
      )
      .sort((a: WalletBalance, b: WalletBalance) => {
        const priorityDiff =
          getPriority(b.blockchain) - getPriority(a.blockchain);
        return priorityDiff !== 0 ? priorityDiff : b.amount - a.amount;
      })
      .map(
        (balance: WalletBalance): FormattedWalletBalance => ({
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue: (prices[balance.currency] || 0) * balance.amount,
        })
      );
  }, [balances, prices]);
  // prices is present in the dependency array as it's used to calculate the usd value

  // used modified unique key
  return (
    <div {...rest}>
      {formattedBalances.map(
        (balance: FormattedWalletBalance, index: number) => (
          <WalletRow
            className={classes.row}
            key={`${balance.currency}-${index}`}
            amount={balance.amount}
            usdValue={balance.usdValue}
            formattedAmount={balance.formatted}
          />
        )
      )}
    </div>
  );
};
