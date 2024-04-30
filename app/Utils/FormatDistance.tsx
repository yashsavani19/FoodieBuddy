export const formatDistance = (distance: string) => {
    const distanceInKm = parseFloat(distance);
    return distanceInKm < 1 
      ? `${distanceInKm * 1000}m` 
      : `${distanceInKm.toFixed(1)}km`;
  };