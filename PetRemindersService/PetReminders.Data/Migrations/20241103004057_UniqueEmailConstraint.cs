using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetReminders.Data.Migrations
{
    /// <inheritdoc />
    public partial class UniqueEmailConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Pets",
                keyColumn: "Id",
                keyValue: new Guid("cf85e479-f743-4309-afca-ac58b347d2f4"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("6d590849-56f0-4418-8c9c-1d19ef1336c6"));

            migrationBuilder.InsertData(
                table: "Pets",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[] { new Guid("d9fb36ab-6849-4e98-af12-ce291f087073"), new DateTime(2024, 11, 3, 0, 40, 57, 499, DateTimeKind.Utc).AddTicks(6504), "TestPet" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLoginAt", "Name", "PasswordHash" },
                values: new object[] { new Guid("c4477470-7d5b-4a7f-956f-6d409f78361a"), new DateTime(2024, 11, 3, 0, 40, 57, 499, DateTimeKind.Utc).AddTicks(6418), "test@example.com", null, "Test User", "test123" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DeleteData(
                table: "Pets",
                keyColumn: "Id",
                keyValue: new Guid("d9fb36ab-6849-4e98-af12-ce291f087073"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c4477470-7d5b-4a7f-956f-6d409f78361a"));

            migrationBuilder.InsertData(
                table: "Pets",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[] { new Guid("cf85e479-f743-4309-afca-ac58b347d2f4"), new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(8026), "TestPet" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLoginAt", "Name", "PasswordHash" },
                values: new object[] { new Guid("6d590849-56f0-4418-8c9c-1d19ef1336c6"), new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(7912), "test@example.com", null, "Test User", "test123" });
        }
    }
}
