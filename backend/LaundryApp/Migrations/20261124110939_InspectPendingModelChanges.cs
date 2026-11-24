using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryApp.Migrations
{
    /// <inheritdoc />
    public partial class InspectPendingModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LaundryOrders_DeliveryMethods_DeliveryMethodId1",
                table: "LaundryOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_LaundryOrders_LaundryLocations_LaundryLocationId1",
                table: "LaundryOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_LaundryItems_LaundryItemId1",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_LaundryItemId1",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_LaundryOrders_DeliveryMethodId1",
                table: "LaundryOrders");

            migrationBuilder.DropIndex(
                name: "IX_LaundryOrders_LaundryLocationId1",
                table: "LaundryOrders");

            migrationBuilder.DropColumn(
                name: "LaundryItemId1",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "DeliveryMethodId1",
                table: "LaundryOrders");

            migrationBuilder.DropColumn(
                name: "LaundryLocationId1",
                table: "LaundryOrders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LaundryItemId1",
                table: "OrderItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryMethodId1",
                table: "LaundryOrders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LaundryLocationId1",
                table: "LaundryOrders",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_LaundryItemId1",
                table: "OrderItems",
                column: "LaundryItemId1");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_DeliveryMethodId1",
                table: "LaundryOrders",
                column: "DeliveryMethodId1");

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_LaundryLocationId1",
                table: "LaundryOrders",
                column: "LaundryLocationId1");

            migrationBuilder.AddForeignKey(
                name: "FK_LaundryOrders_DeliveryMethods_DeliveryMethodId1",
                table: "LaundryOrders",
                column: "DeliveryMethodId1",
                principalTable: "DeliveryMethods",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LaundryOrders_LaundryLocations_LaundryLocationId1",
                table: "LaundryOrders",
                column: "LaundryLocationId1",
                principalTable: "LaundryLocations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_LaundryItems_LaundryItemId1",
                table: "OrderItems",
                column: "LaundryItemId1",
                principalTable: "LaundryItems",
                principalColumn: "Id");
        }
    }
}
