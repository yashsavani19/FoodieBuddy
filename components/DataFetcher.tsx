import { AppContext } from "@/model/AppContext";
import { useContext, useEffect } from "react";

export const DataFetcher = () => {
  const { setRestaurants, setFavourites, setBookmarks, setVisited } =
    useContext(AppContext);
  useEffect(() => {
    (async () => {
        console.log("Calling setRestaurants from DataFetcher");
      await setRestaurants();
      // await setFavourites();
      // await setBookmarks();
      // await setVisited();
    })();
  }, []);

  return null;
};
