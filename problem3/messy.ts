// @ts-nocheck
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
}

// anti-pattern: boxprops are not defined but not specified
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // anti-pattern: not mentioning the props explicitly using object destructuring
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // inefficiency: useEffect runs on every render, because of the empty dependency arary
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.err(error);
      });
  }, []);

  const getPriority = (blockchain: any): number => {
    // anti-pattern: using any type removes any typescript benefits
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          // anti-pattern: lhsPriority is either undefined, or more likely one of the props inherited (all the more reason to use explicit destructuring)
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // inefficiency: no handling for equal priorities
      });
  }, [balances, prices]); // inefficiency: 'prices' is not used in this memo

  // inefficiency: unnecessary creation of a new array
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });


  // anti-pattern: calculation of usdValue here, could be done when formatting and sorting array prior
  // anti-pattern: using index as key is not recommended, as it doesn't help with diffing
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // Anti-pattern: Incorrect type, should be WalletBalance
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // Anti-pattern: Using index as key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
