import { AppContext } from "@/model/AppContext";
import { useContext, useEffect } from "react";

interface DataFetcherProps {
  onLoading: (isLoading: boolean) => void;
}

export const DataFetcher: React.FC<DataFetcherProps> = ({ onLoading }) => {
  const { setRestaurants, setFavourites, setBookmarks, setVisited } =
    useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        onLoading(true);
        console.log("Calling setRestaurants from DataFetcher");
        await setRestaurants();
        // await setUser();
        // await setFavourites();
        // await setBookmarks();
        // await setVisited();
      } catch (error) {
        console.error("DataFetcher error", error);
      } finally {
        onLoading(false);
      }
    })(), [];
  }, []);

  return null;
};
