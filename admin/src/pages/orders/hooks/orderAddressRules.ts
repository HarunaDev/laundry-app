export const requiresPickupAddress = (deliveryMethodId: number): boolean => {
  return deliveryMethodId === 3 || deliveryMethodId === 4;
};

export const requiresDeliveryAddress = (deliveryMethodId: number): boolean => {
  return deliveryMethodId === 2 || deliveryMethodId === 3;
};
