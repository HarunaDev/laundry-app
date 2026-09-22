import type { JSX } from "react";

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  User,
} from "lucide-react";

import StatusBadge from "../../components/ui/StatusBadge";

import {
  useCompleteOrderMutation,
  useGetOrderByIdQuery,
  useConfirmOrderMutation,
} from "../../redux/slices/ordersApiSlice";

// import type { LaundryOrderDetails } from "../../types/orders";

// interface OrderItem {
//   laundryItemId: number;
//   laundryItemName: string;
//   laundryServiceName: string;
//   unitPrice: number;
//   quantity: number;
//   totalPrice: number;
// }

interface OrderActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OrderActionModal = ({
  isOpen,
  title,
  message,
  confirmText,
  isLoading,
  onClose,
  onConfirm,
}: OrderActionModalProps): JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/40
          px-4
        "
    >
      <div
        className="
            w-full
            max-w-md
            rounded-xl
            bg-white
            p-6
            shadow-xl
          "
      >
        <div
          className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-blue-50
            "
        >
          <CheckCircle size={24} className="text-blue-600" />
        </div>

        <h2
          className="
              text-lg
              font-semibold
              text-gray-900
            "
        >
          {title}
        </h2>

        <p
          className="
              mt-2
              text-sm
              leading-6
              text-gray-500
            "
        >
          {message}
        </p>

        <div
          className="
              mt-6
              flex
              justify-end
              gap-3
            "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="
                rounded-lg
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const getStatusLabel = (status: string): string => {
  return status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const OrderDetails = (): JSX.Element => {
  const navigate = useNavigate();

  const { orderId } = useParams<{
    orderId: string;
  }>();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const [action, setAction] = useState<"confirm" | "complete" | null>(null);

  const numericOrderId = Number(orderId);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetOrderByIdQuery(numericOrderId, {
      skip: !orderId || Number.isNaN(numericOrderId),
    });

  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation();

  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();

  const order = data;

  const handleBack = (): void => {
    navigate("/orders");
  };

  const handleAction = (nextAction: "confirm" | "complete"): void => {
    setAction(nextAction);
    setIsActionModalOpen(true);
  };

  const handleCloseModal = (): void => {
    if (isConfirming || isCompleting) {
      return;
    }

    setIsActionModalOpen(false);
    setAction(null);
  };

  const handleConfirmAction = async (): Promise<void> => {
    if (!order) {
      return;
    }

    // if (action === "confirm") {
    //   /*
    //    * The current confirm API requires:
    //    *
    //    * deliveryMethodId
    //    * laundryLocationId
    //    * items
    //    *
    //    * However, the GET /laundry-orders/{id}
    //    * response currently only returns the
    //    * delivery method and location names.
    //    *
    //    * Do not send guessed IDs.
    //    *
    //    * Once the backend exposes those IDs,
    //    * wire useConfirmOrderMutation here.
    //    */

    //   //   console.error(
    //   //     "Order confirmation requires deliveryMethodId and laundryLocationId."
    //   //   );
    //   try {
    //     await confirmOrder({
    //       orderId: order.id,
    //       body: {
    //         deliveryMethodId: order.deliveryMethodId,
    //         laundryLocationId: order.laundryLocationId ?? undefined,
    //         pickupAddress: order.pickupAddress ?? undefined,
    //         deliveryAddress: order.deliveryAddress ?? undefined,
    //         items: order.items.map((item) => ({
    //           laundryItemId: item.laundryItemId,
    //           quantity: item.quantity,
    //         })),
    //       },
    //     }).unwrap();

    //     setIsActionModalOpen(false);
    //     setAction(null);

    //     await refetch();
    //   } catch (error) {
    //     console.error("Failed to confirm order:", error);
    //   }
    //   return;
    // }

    if (action === "confirm") {
      if (order.laundryLocationId === null) {
        console.error("Laundry location is required to confirm this order.");
        return;
      }

      try {
        await confirmOrder({
          orderId: order.id,
          body: {
            deliveryMethodId: order.deliveryMethodId,
            laundryLocationId: order.laundryLocationId,
            pickupAddress: order.pickupAddress ?? undefined,
            deliveryAddress: order.deliveryAddress ?? undefined,
            items: order.items.map((item) => ({
              laundryItemId: item.laundryItemId,
              quantity: item.quantity,
            })),
          },
        }).unwrap();

        setIsActionModalOpen(false);
        setAction(null);

        await refetch();
      } catch (error) {
        console.error("Failed to confirm order:", error);
      }

      return;
    }

    if (action === "complete") {
      try {
        await completeOrder({
          orderId: order.id,
        }).unwrap();

        setIsActionModalOpen(false);
        setAction(null);

        await refetch();
      } catch (error) {
        console.error("Failed to complete order:", error);
      }
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleBack}
          className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-600
              transition
              hover:text-gray-900
            "
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div
          className="
              flex
              min-h-[400px]
              items-center
              justify-center
              rounded-xl
              border
              border-gray-100
              bg-white
            "
        >
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleBack}
          className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-600
              transition
              hover:text-gray-900
            "
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div
          className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-6
            "
        >
          <h2
            className="
                text-base
                font-semibold
                text-red-800
              "
          >
            Unable to load order
          </h2>

          <p
            className="
                mt-1
                text-sm
                text-red-600
              "
          >
            The order could not be found or an error occurred while loading it.
          </p>
        </div>
      </div>
    );
  }

  const isPending = order.status.toLowerCase() === "pending";

  const isInProgress =
    order.status.toLowerCase() === "inprogress" ||
    order.status.toLowerCase() === "in progress";

  const isCompleted = order.status.toLowerCase() === "completed";

  const modalTitle =
    action === "confirm" ? "Confirm this order?" : "Complete this order?";

  const modalMessage =
    action === "confirm"
      ? "This will move the order into processing."
      : "Confirm that the laundry has been completed.";

  const modalConfirmText =
    action === "confirm" ? "Confirm Order" : "Complete Order";

  return (
    <>
      <div className="space-y-6">
        <div
          className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
        >
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="
                  mb-3
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:text-gray-900
                "
            >
              <ArrowLeft size={18} />
              Back to Orders
            </button>

            <div
              className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
            >
              <h1
                className="
                    text-2xl
                    font-bold
                    text-gray-900
                  "
              >
                #ORD-{order.id}
              </h1>

              <StatusBadge status={order.status} />
            </div>

            <p
              className="
                  mt-1
                  text-sm
                  text-gray-500
                "
            >
              Created {formatDate(order.createdAt)}
            </p>
          </div>

          {isPending && (
            <button
              type="button"
              onClick={() => handleAction("confirm")}
              className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                "
            >
              <CheckCircle size={18} />
              Confirm Order
            </button>
          )}

          {isInProgress && (
            <button
              type="button"
              onClick={() => handleAction("complete")}
              className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-green-700
                "
            >
              <CheckCircle size={18} />
              Complete Order
            </button>
          )}

          {isCompleted && (
            <div
              className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-green-50
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-green-700
                "
            >
              <CheckCircle size={18} />
              Order Completed
            </div>
          )}
        </div>

        <div
          className="
              grid
              gap-6
              lg:grid-cols-2
            "
        >
          {/* Customer */}
          <div
            className="
                rounded-xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
              "
          >
            <div
              className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
            >
              <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                  "
              >
                <User size={20} className="text-blue-600" />
              </div>

              <h2
                className="
                    text-base
                    font-semibold
                    text-gray-900
                  "
              >
                Customer
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <p
                  className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                >
                  Name
                </p>

                <p
                  className="
                      mt-1
                      text-sm
                      font-medium
                      text-gray-900
                    "
                >
                  {order.customerName}
                </p>
              </div>

              <div>
                <p
                  className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                >
                  Customer ID
                </p>

                <p
                  className="
                      mt-1
                      break-all
                      text-sm
                      text-gray-700
                    "
                >
                  {order.customerId}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div
            className="
                rounded-xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
              "
          >
            <div
              className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
            >
              <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                  "
              >
                <MapPin size={20} className="text-purple-600" />
              </div>

              <h2
                className="
                    text-base
                    font-semibold
                    text-gray-900
                  "
              >
                Delivery Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p
                  className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                >
                  Delivery Method
                </p>

                <p
                  className="
                      mt-1
                      text-sm
                      font-medium
                      text-gray-900
                    "
                >
                  {order.deliveryMethod}
                </p>
              </div>

              <div>
                <p
                  className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                >
                  Laundry Location
                </p>

                <p
                  className="
                      mt-1
                      text-sm
                      text-gray-700
                    "
                >
                  {order.laundryLocation}
                </p>
              </div>

              {order.pickupAddress && (
                <div>
                  <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-gray-400
                      "
                  >
                    Pickup Address
                  </p>

                  <p
                    className="
                        mt-1
                        text-sm
                        text-gray-700
                      "
                  >
                    {order.pickupAddress}
                  </p>
                </div>
              )}

              {order.deliveryAddress && (
                <div>
                  <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-gray-400
                      "
                  >
                    Delivery Address
                  </p>

                  <p
                    className="
                        mt-1
                        text-sm
                        text-gray-700
                      "
                  >
                    {order.deliveryAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Laundry Items */}
        <div
          className="
              overflow-hidden
              rounded-xl
              border
              border-gray-100
              bg-white
              shadow-sm
            "
        >
          <div
            className="
                flex
                items-center
                gap-3
                border-b
                border-gray-100
                p-6
              "
          >
            <div
              className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-cyan-50
                "
            >
              <Package size={20} className="text-cyan-600" />
            </div>

            <div>
              <h2
                className="
                    text-base
                    font-semibold
                    text-gray-900
                  "
              >
                Laundry Items
              </h2>

              <p
                className="
                    mt-0.5
                    text-sm
                    text-gray-500
                  "
              >
                {order.items.length} item
                {order.items.length === 1 ? "" : "s"} in this order
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="
                      border-b
                      border-gray-100
                      bg-gray-50
                    "
                >
                  <th
                    className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Service
                  </th>

                  <th
                    className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Item
                  </th>

                  <th
                    className="
                        px-6
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Unit Price
                  </th>

                  <th
                    className="
                        px-6
                        py-4
                        text-center
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Quantity
                  </th>

                  <th
                    className="
                        px-6
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-500
                      "
                  >
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.laundryItemId}
                    className="
                          border-b
                          border-gray-100
                        "
                  >
                    <td
                      className="
                            px-6
                            py-4
                            text-sm
                            text-gray-600
                          "
                    >
                      {item.laundryServiceName}
                    </td>

                    <td
                      className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                            text-gray-900
                          "
                    >
                      {item.laundryItemName}
                    </td>

                    <td
                      className="
                            px-6
                            py-4
                            text-right
                            text-sm
                            text-gray-600
                          "
                    >
                      {formatCurrency(item.unitPrice)}
                    </td>

                    <td
                      className="
                            px-6
                            py-4
                            text-center
                            text-sm
                            text-gray-600
                          "
                    >
                      {item.quantity}
                    </td>

                    <td
                      className="
                            px-6
                            py-4
                            text-right
                            text-sm
                            font-medium
                            text-gray-900
                          "
                    >
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div
          className="
              flex
              justify-end
            "
        >
          <div
            className="
                w-full
                rounded-xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
                sm:max-w-md
              "
          >
            <h2
              className="
                  mb-5
                  text-base
                  font-semibold
                  text-gray-900
                "
            >
              Order Summary
            </h2>

            <div className="space-y-3">
              <div
                className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
              >
                <span className="text-gray-500">Items Total</span>

                <span
                  className="
                      font-medium
                      text-gray-900
                    "
                >
                  {formatCurrency(order.itemsTotal)}
                </span>
              </div>

              <div
                className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
              >
                <span className="text-gray-500">Delivery</span>

                <span
                  className="
                      font-medium
                      text-gray-900
                    "
                >
                  {formatCurrency(order.deliveryPrice)}
                </span>
              </div>

              <div
                className="
                    border-t
                    border-gray-100
                    pt-4
                  "
              >
                <div
                  className="
                      flex
                      items-center
                      justify-between
                    "
                >
                  <span
                    className="
                        text-base
                        font-semibold
                        text-gray-900
                      "
                  >
                    Grand Total
                  </span>

                  <span
                    className="
                        text-xl
                        font-bold
                        text-gray-900
                      "
                  >
                    {formatCurrency(order.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div
          className="
              rounded-xl
              border
              border-gray-100
              bg-white
              p-6
              shadow-sm
            "
        >
          <div
            className="
                flex
                items-center
                gap-3
              "
          >
            <Clock size={20} className="text-gray-500" />

            <div>
              <p
                className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
              >
                Current Status
              </p>

              <p
                className="
                    mt-1
                    text-sm
                    font-semibold
                    text-gray-900
                  "
              >
                {getStatusLabel(order.status)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrderActionModal
        isOpen={isActionModalOpen}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalConfirmText}
        isLoading={isConfirming || isCompleting}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default OrderDetails;
