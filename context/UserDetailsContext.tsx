import tw from "twin.macro";
import { createContext, useState, useContext, useEffect } from "react";
import useCurrentUserDb from "../hooks/queries/auth/useCurrentUserDb";

interface FormState {
  name?: string;
  street: string;
  apartment: string;
  town: string;
  country: string;
  postcode: string;
  email: string;
}

interface UserDetailsContextType {
  userDetailsFormState: FormState;
  setUserDetailsFormState: (formState: FormState) => void;
  isChecked: boolean;
  toggleChecked: () => void;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(
  undefined
);

export const UserDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentUserDb = useCurrentUserDb();
  const [userDetailsFormState, setUserDetailsFormState] = useState<FormState>({
    name: "",
    street: "",
    apartment: "",
    town: "",
    country: "United Kingdom",
    postcode: "",
    email: "",
  });

  const [isChecked, setIsChecked] = useState(true);

  const toggleChecked = () => {
    setIsChecked((prev) => !prev);
    // Transfer UserDetails details to shipping details if toggled to be the same
    // if (!isChecked) {
    setUserDetailsFormState(userDetailsFormState);
    // }
  };

  useEffect(() => {
    if (!currentUserDb.data?.billingAddress) {
      return;
    }

    setUserDetailsFormState(currentUserDb.data.billingAddress);
  }, [currentUserDb.data?.billingAddress]);

  return (
    <UserDetailsContext.Provider
      value={{
        userDetailsFormState,
        setUserDetailsFormState,
        isChecked,
        toggleChecked,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetailsContext = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error(
      "useUserDetailsContext must be used within a UserDetailsProvider"
    );
  }
  return context;
};
