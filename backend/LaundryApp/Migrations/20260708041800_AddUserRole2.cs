using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryApp.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRole2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "cb6ff3ef-e8d8-4c8a-a752-fba5bb6fac64");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "EmailVerified", "PasswordHash", "Role", "UserName" },
                values: new object[] { "a005670-0050-2000-0040-104020700001", "superadmin@laundryapp.com", false, "123456", 2, "superadmin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "a005670-0050-2000-0040-104020700001");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "EmailVerified", "PasswordHash", "Role", "UserName" },
                values: new object[] { "cb6ff3ef-e8d8-4c8a-a752-fba5bb6fac64", "superadmin@laundryapp.com", false, "AQAAAAIAAYagAAAAELHHnrh+bShCtvKSF9pytINv0se8J/y4s003++Oy6DlVmlZul0vXnlrdthYmeK/VMQ==", 2, "superadmin" });
        }
    }
}
