using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryApp.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LaundryOrders_Users_UserId1",
                table: "LaundryOrders");

            migrationBuilder.DropIndex(
                name: "IX_LaundryOrders_UserId1",
                table: "LaundryOrders");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "LaundryOrders");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "LaundryOrders",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LaundryOrders_UserId1",
                table: "LaundryOrders",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_LaundryOrders_Users_UserId1",
                table: "LaundryOrders",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
