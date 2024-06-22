import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

interface PurchaseContextValue {
  count: number;
  pricePerSachet: number;
  totalPrice: number;
  totalSachets: number;
  formattedPurchaseDate: string;
  day: number;
  month: number;
  year: number;
  incrementCount: () => void;
  decrementCount: () => void;
  setCount: Dispatch<SetStateAction<number>>;
  updatePricePerSachet: (newPrice: number) => void;
}

const PurchaseContext = createContext<PurchaseContextValue>({
  count: 1,
  pricePerSachet: 23,
  totalPrice: 0,
  totalSachets: 0,
  formattedPurchaseDate: "",
  day: 0,
  month: 0,
  year: 0,
  incrementCount: () => {},
  decrementCount: () => {},
  updatePricePerSachet: () => {},
  setCount: () => {},
});

const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(1);
  const [pricePerSachet, setPricePerSachet] = useState(1.925);

  const [totalPrice, setTotalPrice] = useState(count * pricePerSachet * 14);
  const [totalSachets, setTotalSachets] = useState(count * 14);

  const purchaseDate = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedPurchaseDate = `${purchaseDate.getDate()} ${
    monthNames[purchaseDate.getMonth()]
  } ${purchaseDate.getFullYear()}`;
  const day = purchaseDate.getDate();
  const month = purchaseDate.getMonth();
  const year = purchaseDate.getFullYear();

  const incrementCount = useCallback(() => {
    setCount((prevCount) =>
      prevCount === 10 ? prevCount : Math.max(prevCount + 1, 1)
    );
  }, []);

  const decrementCount = useCallback(() => {
    setCount((prevCount) => Math.max(prevCount - 1, 1));
  }, []);

  const updatePricePerSachet = useCallback((newPrice: number) => {
    setPricePerSachet(newPrice);
  }, []);

  useEffect(() => {
    setTotalPrice(count * pricePerSachet * 14);
    setTotalSachets(count * 14);
  }, [count, pricePerSachet]);

  const value: PurchaseContextValue = {
    count,
    pricePerSachet,
    totalPrice,
    totalSachets,
    formattedPurchaseDate,
    day,
    month,
    year,
    incrementCount,
    decrementCount,
    updatePricePerSachet,
    setCount,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

export { PurchaseContext, PurchaseProvider };
