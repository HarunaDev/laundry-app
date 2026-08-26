using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LaundryApp.Migrations
{
    /// <inheritdoc />
    public partial class LaundryOrderModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LaundryOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    DeliveryMethodId = table.Column<int>(type: "integer", nullable: false),
                    LaundryLocationId = table.Column<int>(type: "integer", nullable: true),
                    DeliveryAddress = table.Column<string>(type: "text", nullable: true),
                    DeliveryPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ItemsTotal = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    GrandTotal = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConfirmedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<string>(type: "text", nullable: true),
                    DeliveryMethodId1 = table.Column<int>(type: "integer", nullable: true),
                    LaundryLocationId1 = table.Column<int>(type: "integer", nullable: true),
                    UserId1 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LaundryOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LaundryOrders_DeliveryMethods_DeliveryMethodId",
                        column: x => x.DeliveryMethodId,
                        principalTable: "DeliveryMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LaundryOrders_DeliveryMethods_DeliveryMethodId1",
                        column: x => x.DeliveryMethodId1,
                        principalTable: "DeliveryMethods",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LaundryOrders_LaundryLocations_LaundryLocationId",
                        column: x => x.LaundryLocationId,
                        principalTable: "LaundryLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LaundryOrders_LaundryLocations_LaundryLocationId1",
                        column: x => x.LaundryLocationId1,
                        principalTable: "LaundryLocations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LaundryOrders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LaundryOrders_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LaundryOrderId = table.Column<int>(type: "integer", nullable: false),
                    LaundryItemId = table.Column<int>(type: "integer", nullable: false),
                    LaundryItemName = table.Column<string>(type: "text", nullable: false),
                    LaundryServiceName = table.Column<string>(type: "text", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    LaundryItemId1 = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_LaundryItems_LaundryItemId",
                        column: x => x.LaundryItemId,
                        principalTable: "LaundryItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_LaundryItems_LaundryItemId1",
                        column: x => x.LaundryItemId1,
                        principalTable: "LaundryItems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrderItems_LaundryOrders_LaundryOrderId",
                        column: x => x.LaundryOrderId,
                        principalTable: "LaundryOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_DeliveryMethodId",
                table: "LaundryOrders",
                column: "DeliveryMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_DeliveryMethodId1",
                table: "LaundryOrders",
                column: "DeliveryMethodId1");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_LaundryLocationId",
                table: "LaundryOrders",
                column: "LaundryLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_LaundryLocationId1",
                table: "LaundryOrders",
                column: "LaundryLocationId1");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_UserId",
                table: "LaundryOrders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_UserId1",
                table: "LaundryOrders",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_LaundryItemId",
                table: "OrderItems",
                column: "LaundryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_LaundryItemId1",
                table: "OrderItems",
                column: "LaundryItemId1");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_LaundryOrderId",
                table: "OrderItems",
                column: "LaundryOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "LaundryOrders");
        }
    }
}
