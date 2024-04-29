import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface StarRatingProps {
  rating: number;  
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const fractionalPart = rating % 1;
  let halfStar = 0;
  let additionalFullStar = 0;

  if (fractionalPart <= 0.2) {
    halfStar = 0; // No half star
  } else if (fractionalPart >= 0.8) {
    additionalFullStar = 1; // Round up to the next full star
  } else if (fractionalPart >= 0.29 && fractionalPart <= 0.7) {
    halfStar = 1; // Display a half star for 0.3 to 0.7
  }

  const noStars = 5 - fullStars - halfStar - additionalFullStar; // Adjust noStars calculation

  return (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(fullStars + additionalFullStar)].map((_, index) => (
        <Icon testID="full-star" key={`full-${index}`} name="star" size={14} color="#ffd700" />
      ))}
      {halfStar > 0 && (
        <Icon testID="half-star" key="half-1" name="star-half-o" size={14} color="#ffd700" />
      )}
      {[...Array(noStars)].map((_, index) => (
        <Icon testID="empty-star" key={`empty-${index}`} name="star-o" size={14} color="#ffd700" />
      ))}
    </View>
  );
};

export default StarRating;
