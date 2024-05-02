import { AppContext } from "@/context/AppContext";
import { useContext, useEffect } from "react";

interface DataFetcherProps {
  onLoading?: (isLoading: boolean) => void;
}

export const DataFetcher: React.FC<DataFetcherProps> = ({ onLoading }) => {
  const { setRestaurants } =
    useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        if(onLoading) onLoading(true);
        console.log("Calling setRestaurants from DataFetcher");
        await setRestaurants();
        // await setUser();
        // await setFavourites();
        // await setBookmarks();
        // await setVisited();
      } catch (error) {
        console.error("DataFetcher error", error);
      } finally {
        if(onLoading) onLoading(false);
      }
    })(), [];
  }, []);

  return null;
};
