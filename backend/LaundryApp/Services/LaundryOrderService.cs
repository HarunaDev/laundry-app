using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.LaundryOrder;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class LaundryOrderService
{
    private static (
    bool RequiresPickupAddress,
    bool RequiresDeliveryAddress)
    GetAddressRequirements(
        string deliveryMethodName)
    {
        return deliveryMethodName switch
        {
            "Drop-off/Pick-up" =>
                (false, false),

            "Drop-off/Delivery" =>
                (false, true),

            "Pick-up/Pick-up" =>
                (true, false),

            "Pick-up/Delivery" =>
                (true, true),

            _ => throw new BadRequestException(
                "Invalid delivery method.")
        };
    }
    private readonly LaundryAppDbContext _context;

    public LaundryOrderService(
        LaundryAppDbContext context)
    {
        _context = context;
    }


    // ==========================================================
    // CREATE ORDER
    // CLIENT:
    // UserId comes from JWT
    //
    // ADMIN / SUPERADMIN:
    // UserId is supplied in the request
    // ==========================================================

    public async Task<LaundryOrderResponseDto> CreateOrderAsync(
        CreateLaundryOrderDto dto,
        ClaimsPrincipal currentUser)
    {
        var currentUserId =
            currentUser.FindFirstValue(
                ClaimTypes.NameIdentifier);

        var currentRole =
            currentUser.FindFirstValue(
                ClaimTypes.Role);

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            throw new UnauthorizedException(
                "Unable to determine the current user.");
        }


        // ------------------------------------------------------
        // DETERMINE WHICH USER THE ORDER BELONGS TO
        // ------------------------------------------------------

        string customerId;

        if (currentRole == UserRole.Admin.ToString() ||
            currentRole == UserRole.SuperAdmin.ToString())
        {
            if (string.IsNullOrWhiteSpace(dto.UserId))
            {
                throw new BadRequestException(
                    "UserId is required when an admin creates an order.");
            }

            customerId = dto.UserId;
        }
        else
        {
            customerId = currentUserId;
        }


        // ------------------------------------------------------
        // VALIDATE CUSTOMER
        // ------------------------------------------------------

        var customer = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Id == customerId &&
                u.Role == UserRole.Client &&
                !u.IsDeleted);

        if (customer is null)
        {
            throw new NotFoundException(
                "Customer not found.");
        }


        // ------------------------------------------------------
        // VALIDATE DELIVERY METHOD
        // ------------------------------------------------------

        var deliveryMethod =
            await _context.DeliveryMethods
                .FirstOrDefaultAsync(d =>
                    d.Id == dto.DeliveryMethodId &&
                    d.IsActive &&
                    !d.IsDeleted);

        if (deliveryMethod is null)
        {
            throw new NotFoundException(
                "Delivery method not found.");
        }

        // EXTRA VALIDATION FOR DELIVERY METHOD
        var (requiresPickupAddress, requiresDeliveryAddress) = GetAddressRequirements(
        deliveryMethod.Name);


        if (requiresPickupAddress &&
            string.IsNullOrWhiteSpace(dto.PickupAddress))
        {
            throw new BadRequestException(
                "Pickup address is required for the selected delivery method.");
        }


        if (requiresDeliveryAddress &&
            string.IsNullOrWhiteSpace(dto.DeliveryAddress))
        {
            throw new BadRequestException(
                "Delivery address is required for the selected delivery method.");
        }


        // ------------------------------------------------------
        // VALIDATE LAUNDRY LOCATION
        // ------------------------------------------------------

        LaundryLocation? laundryLocation = null;

        if (dto.LaundryLocationId.HasValue)
        {
            laundryLocation =
                await _context.LaundryLocations
                    .FirstOrDefaultAsync(l =>
                        l.Id == dto.LaundryLocationId.Value &&
                        l.IsActive &&
                        !l.IsDeleted);

            if (laundryLocation is null)
            {
                throw new NotFoundException(
                    "Laundry location not found.");
            }
        }


        // ------------------------------------------------------
        // VALIDATE LAUNDRY ITEMS
        // ------------------------------------------------------

        var itemIds = dto.Items
            .Select(i => i.LaundryItemId)
            .Distinct()
            .ToList();

        var laundryItems =
            await _context.LaundryItems
                .Where(i =>
                    itemIds.Contains(i.Id) &&
                    !i.IsDeleted)
                .Include(i => i.LaundryService)
                .ToListAsync();

        if (laundryItems.Count != itemIds.Count)
        {
            throw new BadRequestException(
                "One or more laundry items are invalid.");
        }


        // ------------------------------------------------------
        // DETERMINE INITIAL STATUS
        //
        // Client -> Pending
        // Admin / SuperAdmin -> InProgress
        // ------------------------------------------------------

        var initialStatus =
            currentRole == UserRole.Admin.ToString() ||
            currentRole == UserRole.SuperAdmin.ToString()
                ? OrderStatus.InProgress
                : OrderStatus.Pending;


        // ------------------------------------------------------
        // CREATE ORDER
        // ------------------------------------------------------

        var order = new LaundryOrder
        {
            UserId = customer.Id,

            DeliveryMethodId = deliveryMethod.Id,

            LaundryLocationId =
                laundryLocation?.Id,

            PickupAddress =
            requiresPickupAddress
            ? dto.PickupAddress
            : null,

            DeliveryAddress =
            requiresDeliveryAddress
            ? dto.DeliveryAddress
            : null,

            DeliveryPrice =
                deliveryMethod.Price,

            Status =
                initialStatus,

            CreatedAt =
                DateTime.UtcNow
        };


        // ------------------------------------------------------
        // CREATE ORDER ITEMS
        // ------------------------------------------------------

        foreach (var requestItem in dto.Items)
        {
            var laundryItem =
                laundryItems.First(i =>
                    i.Id == requestItem.LaundryItemId);

            var orderItem = new OrderItem
            {
                LaundryItemId =
                    laundryItem.Id,

                LaundryItemName =
                    laundryItem.Name,

                LaundryServiceName =
                    laundryItem.LaundryService.Name,

                UnitPrice =
                    laundryItem.Price,

                Quantity =
                    requestItem.Quantity,

                TotalPrice =
                    laundryItem.Price *
                    requestItem.Quantity
            };

            order.OrderItems.Add(orderItem);
        }


        // ------------------------------------------------------
        // CALCULATE TOTALS
        // ------------------------------------------------------

        order.ItemsTotal =
            order.OrderItems.Sum(i =>
                i.TotalPrice);

        order.GrandTotal =
            order.ItemsTotal +
            order.DeliveryPrice;


        // ------------------------------------------------------
        // SAVE ORDER
        // ------------------------------------------------------

        _context.LaundryOrders.Add(order);

        await _context.SaveChangesAsync();


        // ------------------------------------------------------
        // RETURN RESPONSE
        // ------------------------------------------------------

        return await GetOrderResponseAsync(order.Id);
    }


    // ==========================================================
    // GET ORDER BY ID
    //
    // Client can only get their own order.
    // Admin / SuperAdmin can get any order.
    // ==========================================================

    public async Task<LaundryOrderResponseDto>
        GetByIdAsync(
            int orderId,
            ClaimsPrincipal currentUser)
    {
        var currentUserId =
            currentUser.FindFirstValue(
                ClaimTypes.NameIdentifier);

        var currentRole =
            currentUser.FindFirstValue(
                ClaimTypes.Role);

        var order = await _context.LaundryOrders
            .Include(o => o.User)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.LaundryLocation)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                !o.IsDeleted);

        if (order is null)
        {
            throw new NotFoundException(
                "Order not found.");
        }


        // Clients can only access their own orders

        if (currentRole == UserRole.Client.ToString() &&
            order.UserId != currentUserId)
        {
            throw new UnauthorizedException(
                "You are not authorized to access this order.");
        }


        return MapToResponse(order);
    }


    // ==========================================================
    // GET CURRENT USER ORDERS
    // ==========================================================

    public async Task<IEnumerable<LaundryOrderDto>>
        GetMyOrdersAsync(
            ClaimsPrincipal currentUser)
    {
        var currentUserId =
            currentUser.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            throw new UnauthorizedException(
                "Unable to determine the current user.");
        }


        return await _context.LaundryOrders
            .Where(o =>
                o.UserId == currentUserId &&
                !o.IsDeleted)
            .Include(o => o.User)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.LaundryLocation)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new LaundryOrderDto
            {
                Id = o.Id,

                CustomerId =
                    o.UserId,

                CustomerName =
                    o.User.UserName,

                DeliveryMethod =
                    o.DeliveryMethod.Name,

                LaundryLocation =
                    o.LaundryLocation != null
                        ? o.LaundryLocation.Name
                        : null,

                PickupAddress =
                    o.DeliveryAddress,

                DeliveryAddress =
                    o.DeliveryAddress,

                DeliveryPrice =
                    o.DeliveryPrice,

                ItemsTotal =
                    o.ItemsTotal,

                GrandTotal =
                    o.GrandTotal,

                Status =
                    o.Status.ToString(),

                CreatedAt =
                    o.CreatedAt
            })
            .ToListAsync();
    }


    // ==========================================================
    // GET ALL ORDERS
    //
    // ADMIN / SUPERADMIN
    // ==========================================================

    public async Task<IEnumerable<LaundryOrderDto>>
        GetAllAsync()
    {
        return await _context.LaundryOrders
            .Where(o => !o.IsDeleted)
            .Include(o => o.User)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.LaundryLocation)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new LaundryOrderDto
            {
                Id = o.Id,

                CustomerId =
                    o.UserId,

                CustomerName =
                    o.User.UserName,

                DeliveryMethod =
                    o.DeliveryMethod.Name,

                LaundryLocation =
                    o.LaundryLocation != null
                        ? o.LaundryLocation.Name
                        : null,

                PickupAddress =
                    o.DeliveryAddress,

                DeliveryAddress =
                    o.DeliveryAddress,

                DeliveryPrice =
                    o.DeliveryPrice,

                ItemsTotal =
                    o.ItemsTotal,

                GrandTotal =
                    o.GrandTotal,

                Status =
                    o.Status.ToString(),

                CreatedAt =
                    o.CreatedAt
            })
            .ToListAsync();
    }


    // ==========================================================
    // CONFIRM ORDER
    //
    // ADMIN / SUPERADMIN ONLY
    //
    // Pending -> InProgress
    // ==========================================================

    public async Task<LaundryOrderResponseDto>
        ConfirmOrderAsync(
            int orderId,
            ConfirmLaundryOrderDto dto,
            ClaimsPrincipal currentUser)
    {
        var currentUserId =
            currentUser.FindFirstValue(
                ClaimTypes.NameIdentifier);

        var order = await _context.LaundryOrders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                !o.IsDeleted);

        if (order is null)
        {
            throw new NotFoundException(
                "Order not found.");
        }


        if (order.Status != OrderStatus.Pending)
        {
            throw new BadRequestException(
                "Only pending orders can be confirmed.");
        }


        // ------------------------------------------------------
        // VALIDATE DELIVERY METHOD
        // ------------------------------------------------------

        var deliveryMethod =
            await _context.DeliveryMethods
                .FirstOrDefaultAsync(d =>
                    d.Id == dto.DeliveryMethodId &&
                    d.IsActive &&
                    !d.IsDeleted);

        if (deliveryMethod is null)
        {
            throw new NotFoundException(
                "Delivery method not found.");
        }

        var (requiresPickupAddress, requiresDeliveryAddress) = GetAddressRequirements(deliveryMethod.Name);


        if (requiresPickupAddress &&
            string.IsNullOrWhiteSpace(dto.PickupAddress))
        {
            throw new BadRequestException(
                "Pickup address is required for the selected delivery method.");
        }


        if (requiresDeliveryAddress &&
            string.IsNullOrWhiteSpace(dto.DeliveryAddress))
        {
            throw new BadRequestException(
                "Delivery address is required for the selected delivery method.");
        }


        // ------------------------------------------------------
        // VALIDATE LAUNDRY LOCATION
        // ------------------------------------------------------

        LaundryLocation? laundryLocation = null;

        if (dto.LaundryLocationId.HasValue)
        {
            laundryLocation =
                await _context.LaundryLocations
                    .FirstOrDefaultAsync(l =>
                        l.Id == dto.LaundryLocationId.Value &&
                        l.IsActive &&
                        !l.IsDeleted);

            if (laundryLocation is null)
            {
                throw new NotFoundException(
                    "Laundry location not found.");
            }
        }


        // ------------------------------------------------------
        // VALIDATE ITEMS
        // ------------------------------------------------------

        var itemIds = dto.Items
            .Select(i => i.LaundryItemId)
            .Distinct()
            .ToList();

        var laundryItems =
            await _context.LaundryItems
                .Where(i =>
                    itemIds.Contains(i.Id) &&
                    !i.IsDeleted)
                .Include(i => i.LaundryService)
                .ToListAsync();

        if (laundryItems.Count != itemIds.Count)
        {
            throw new BadRequestException(
                "One or more laundry items are invalid.");
        }


        // ------------------------------------------------------
        // UPDATE ORDER
        // ------------------------------------------------------

        order.DeliveryMethodId =
            deliveryMethod.Id;

        order.DeliveryPrice =
            deliveryMethod.Price;

        order.LaundryLocationId =
            laundryLocation?.Id;

        // order.DeliveryAddress =
        //     dto.DeliveryAddress;

        order.PickupAddress = requiresPickupAddress
        ? dto.PickupAddress
        : null;


        order.DeliveryAddress =
            requiresDeliveryAddress
                ? dto.DeliveryAddress
                : null;

        // ------------------------------------------------------
        // REMOVE OLD ITEMS
        // ------------------------------------------------------

        _context.OrderItems.RemoveRange(
            order.OrderItems);


        // ------------------------------------------------------
        // ADD UPDATED ITEMS
        // ------------------------------------------------------

        foreach (var requestItem in dto.Items)
        {
            var laundryItem =
                laundryItems.First(i =>
                    i.Id == requestItem.LaundryItemId);

            var orderItem = new OrderItem
            {
                LaundryItemId =
                    laundryItem.Id,

                LaundryItemName =
                    laundryItem.Name,

                LaundryServiceName =
                    laundryItem.LaundryService.Name,

                UnitPrice =
                    laundryItem.Price,

                Quantity =
                    requestItem.Quantity,

                TotalPrice =
                    laundryItem.Price *
                    requestItem.Quantity
            };

            order.OrderItems.Add(orderItem);
        }


        // ------------------------------------------------------
        // RECALCULATE TOTALS
        // ------------------------------------------------------

        order.ItemsTotal =
            order.OrderItems.Sum(i =>
                i.TotalPrice);

        order.GrandTotal =
            order.ItemsTotal +
            order.DeliveryPrice;


        // ------------------------------------------------------
        // UPDATE STATUS
        // ------------------------------------------------------

        order.Status =
            OrderStatus.InProgress;

        order.ConfirmedAt =
            DateTime.UtcNow;

        order.ConfirmedBy =
            currentUserId;

        order.UpdatedAt =
            DateTime.UtcNow;


        await _context.SaveChangesAsync();


        return await GetOrderResponseAsync(
            order.Id);
    }


    // ==========================================================
    // COMPLETE ORDER
    //
    // ADMIN / SUPERADMIN
    //
    // InProgress -> Completed
    // ==========================================================

    public async Task<LaundryOrderResponseDto>
        CompleteOrderAsync(
            int orderId)
    {
        var order = await _context.LaundryOrders
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                !o.IsDeleted);

        if (order is null)
        {
            throw new NotFoundException(
                "Order not found.");
        }


        if (order.Status != OrderStatus.InProgress)
        {
            throw new BadRequestException(
                "Only orders in progress can be completed.");
        }


        order.Status =
            OrderStatus.Completed;

        order.CompletedAt =
            DateTime.UtcNow;

        order.UpdatedAt =
            DateTime.UtcNow;


        await _context.SaveChangesAsync();


        return await GetOrderResponseAsync(
            order.Id);
    }


    // ==========================================================
    // GET COMPLETE ORDER RESPONSE
    // ==========================================================

    private async Task<LaundryOrderResponseDto>
        GetOrderResponseAsync(
            int orderId)
    {
        var order = await _context.LaundryOrders
            .Include(o => o.User)
            .Include(o => o.DeliveryMethod)
            .Include(o => o.LaundryLocation)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                !o.IsDeleted);

        if (order is null)
        {
            throw new NotFoundException(
                "Order not found.");
        }

        return MapToResponse(order);
    }


    // ==========================================================
    // MAP ENTITY TO RESPONSE DTO
    // ==========================================================

    private static LaundryOrderResponseDto
        MapToResponse(
            LaundryOrder order)
    {
        return new LaundryOrderResponseDto
        {
            Id = order.Id,

            CustomerId =
                order.UserId,

            CustomerName =
                order.User.UserName,

            DeliveryMethod =
                order.DeliveryMethod.Name,

            LaundryLocation =
                order.LaundryLocation?.Name,

            PickupAddress =
                order.PickupAddress,

            DeliveryAddress =
                order.DeliveryAddress,

            DeliveryPrice =
                order.DeliveryPrice,

            ItemsTotal =
                order.ItemsTotal,

            GrandTotal =
                order.GrandTotal,

            Status =
                order.Status.ToString(),

            CreatedAt =
                order.CreatedAt,

            Items =
                order.OrderItems.Select(i =>
                    new OrderItemDto
                    {
                        LaundryItemId =
                            i.LaundryItemId,

                        LaundryItemName =
                            i.LaundryItemName,

                        LaundryServiceName =
                            i.LaundryServiceName,

                        UnitPrice =
                            i.UnitPrice,

                        Quantity =
                            i.Quantity,

                        TotalPrice =
                            i.TotalPrice
                    })
                    .ToList()
        };
    }
}