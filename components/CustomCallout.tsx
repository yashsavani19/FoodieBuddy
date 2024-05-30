// CustomCallout.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import StarRating from "./StarRating";
import images from "@/assets/data/images";

interface CustomCalloutProps {
  name: string;
  rating?: number;
  image?: string;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({
  name,
  rating,
  image,
}) => {
  return (
    <View style={styles.calloutContainer}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.ratingContainer}>
        {rating !== undefined && <StarRating rating={rating} />}
      </View>
      <WebView
        style={styles.webViewStyle}
        source={{
          html: `
          <div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
          <img src="${
            image || images.defaultRestaurantImage
          }" style="width: 100%; height: 100%; object-fit: cover; object-position: center center;"/>
      </div>
      
          `,
        }}
        automaticallyAdjustContentInsets={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  price: {
    marginLeft: 5,
  },
  webViewStyle: {
    width: 180,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
  },
});

export default CustomCallout;
