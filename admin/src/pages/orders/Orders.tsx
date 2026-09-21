import { useState, type JSX } from "react";

import PageHeader from "../../components/ui/PageHeader";

import Pagination from "../../components/ui/Pagination";

import OrdersFilters from "./components/ui/OrdersFilters";

import OrdersTable from "./components/layout/OrdersTable";
import CreateOrderModal from "./components/ui/CreateOrderModal";

import { useOrders } from "./hooks/useOrders";
import { useCreateOrder } from "./hooks/useCreateOrder";
import Breadcrumb from "../../components/ui/Breadcrumb";

const Orders = (): JSX.Element => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    orders,

    status,
    search,

    pageNumber,

    isLoading,
    isFetching,
    isError,

    setStatus,
    setSearch,

    goToNextPage,
    goToPreviousPage,

    hasNextPage,
    refetch,
  } = useOrders();

  /*
   * Create order
   */
  const {
    form,

    selectedServiceId,
    selectedItems,

    users,
    services,
    deliveryMethods,
    locations,
    laundryItems,

    pickupAddressRequired,
    deliveryAddressRequired,

    isLoading: isCreateOrderDataLoading,

    isCreating,

    setUserId,
    setServiceId,
    setDeliveryMethodId,
    setLaundryLocationId,
    setPickupAddress,
    setDeliveryAddress,

    addItem,
    removeItem,
    updateQuantity,

    submit,
    reset,
  } = useCreateOrder();

  const handleCreateOrder = () => {
    // Open create-order modal here.
    reset();
    setIsCreateModalOpen(true);
  };

  /*
   * Close modal
   */
  const handleCloseCreateModal = () => {
    if (isCreating) {
      return;
    }

    setIsCreateModalOpen(false);
    reset();
  };

  /*
   * Submit order
   */
  const handleSubmitCreateOrder = async () => {
    try {
      await submit();

      setIsCreateModalOpen(false);
      reset();

      await refetch();
    } catch (error) {
      /*
       * The modal remains open when
       * the API request fails so the
       * user can see/correct the form.
       *
       * RTK Query's error state is
       * available through useCreateOrder.
       */
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <PageHeader
        title="Orders"
        breadcrumb={
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
              },
              {
                label: "Orders",
              },
            ]}
          />
        }
      />

      {/* Filters */}

      <OrdersFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCreateOrder={handleCreateOrder}
      />

      {/* Error */}

      {isError && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          Unable to load orders. Please try again.
        </div>
      )}

      {/* Table Card */}

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
        <OrdersTable orders={orders} isLoading={isLoading || isFetching} />

        <Pagination
          pageNumber={pageNumber}
          hasNextPage={hasNextPage}
          isLoading={isFetching}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      </div>

      {/* Create Order Modal */}

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        isLoading={isCreateOrderDataLoading}
        isSubmitting={isCreating}
        users={users}
        services={services}
        deliveryMethods={deliveryMethods}
        locations={locations}
        laundryItems={laundryItems}
        selectedServiceId={
          selectedServiceId
        }
        selectedItems={
          selectedItems
        }
        userId={form.userId}
        // serviceId={form.serviceId}
        deliveryMethodId={form.deliveryMethodId}
        laundryLocationId={form.laundryLocationId}
        pickupAddress={form.pickupAddress}
        deliveryAddress={form.deliveryAddress}
        items={form.items}
        pickupAddressRequired={pickupAddressRequired}
        deliveryAddressRequired={deliveryAddressRequired}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreateOrder}
        onUserChange={setUserId}
        onServiceChange={setServiceId}
        onDeliveryMethodChange={setDeliveryMethodId}
        onLocationChange={setLaundryLocationId}
        onPickupAddressChange={setPickupAddress}
        onDeliveryAddressChange={setDeliveryAddress}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onQuantityChange={updateQuantity}
      />
    </div>
  );
};

export default Orders;
