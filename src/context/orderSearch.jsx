import { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const OrderSearchContext = createContext(null);

export function OrderSearchProvider({ children }) {
  const [draft, setDraft] = useState("");
  const [applied, setApplied] = useState("");

  const commitSearch = useCallback(() => {
    setApplied(draft.trim());
  }, [draft]);

  const clearSearch = useCallback(() => {
    setDraft("");
    setApplied("");
  }, []);

  const setAppliedSearch = useCallback((value) => {
    const next = (value || "").trim();
    setDraft(next);
    setApplied(next);
  }, []);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      applied,
      commitSearch,
      clearSearch,
      setAppliedSearch,
    }),
    [draft, applied, commitSearch, clearSearch, setAppliedSearch]
  );

  return (
    <OrderSearchContext.Provider value={value}>{children}</OrderSearchContext.Provider>
  );
}

OrderSearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useOrderSearch() {
  const context = useContext(OrderSearchContext);
  if (!context) {
    throw new Error("useOrderSearch must be used within OrderSearchProvider");
  }
  return context;
}

export default OrderSearchProvider;
