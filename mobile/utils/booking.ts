export function requiresPickupAddress(
  deliveryMethodId: number | null
): boolean {
  return deliveryMethodId === 3 || deliveryMethodId === 4;
}

export function requiresDeliveryAddress(
  deliveryMethodId: number | null
): boolean {
  return deliveryMethodId === 2 || deliveryMethodId === 3;
}

export function isValidBookingAddress(
  deliveryMethodId: number | null,
  pickupAddress: string,
  deliveryAddress: string
): boolean {
  if (deliveryMethodId === null) {
    return false;
  }

  if (
    requiresPickupAddress(deliveryMethodId) &&
    pickupAddress.trim().length === 0
  ) {
    return false;
  }

  if (
    requiresDeliveryAddress(deliveryMethodId) &&
    deliveryAddress.trim().length === 0
  ) {
    return false;
  }

  return true;
}
