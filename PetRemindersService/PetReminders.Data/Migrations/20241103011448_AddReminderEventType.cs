using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetReminders.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReminderEventType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReminderEvent_Pets_PetId",
                table: "ReminderEvent");

            migrationBuilder.DropForeignKey(
                name: "FK_ReminderEvent_Users_UserId",
                table: "ReminderEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReminderEvent",
                table: "ReminderEvent");

            migrationBuilder.DeleteData(
                table: "Pets",
                keyColumn: "Id",
                keyValue: new Guid("d9fb36ab-6849-4e98-af12-ce291f087073"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c4477470-7d5b-4a7f-956f-6d409f78361a"));

            migrationBuilder.RenameTable(
                name: "ReminderEvent",
                newName: "ReminderEvents");

            migrationBuilder.RenameIndex(
                name: "IX_ReminderEvent_UserId",
                table: "ReminderEvents",
                newName: "IX_ReminderEvents_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ReminderEvent_PetId",
                table: "ReminderEvents",
                newName: "IX_ReminderEvents_PetId");

            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "ReminderEvents",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReminderEvents",
                table: "ReminderEvents",
                column: "Id");

            migrationBuilder.InsertData(
                table: "Pets",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[] { new Guid("24a728b2-409d-4c3d-8504-084a84a0527d"), new DateTime(2024, 11, 3, 1, 14, 48, 473, DateTimeKind.Utc).AddTicks(4497), "TestPet" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLoginAt", "Name", "PasswordHash" },
                values: new object[] { new Guid("58cb444b-8d65-4671-9a65-69921a1488f1"), new DateTime(2024, 11, 3, 1, 14, 48, 473, DateTimeKind.Utc).AddTicks(4335), "test@example.com", null, "Test User", "test123" });

            migrationBuilder.InsertData(
                table: "ReminderEvents",
                columns: new[] { "Id", "EventTIme", "EventType", "PetId", "UserId" },
                values: new object[] { new Guid("2ff9c1f7-9ace-428a-871b-3525d7a1f2b8"), new DateTime(2024, 11, 3, 1, 14, 48, 473, DateTimeKind.Utc).AddTicks(4520), "Feeding", new Guid("24a728b2-409d-4c3d-8504-084a84a0527d"), new Guid("58cb444b-8d65-4671-9a65-69921a1488f1") });

            migrationBuilder.AddForeignKey(
                name: "FK_ReminderEvents_Pets_PetId",
                table: "ReminderEvents",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReminderEvents_Users_UserId",
                table: "ReminderEvents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReminderEvents_Pets_PetId",
                table: "ReminderEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_ReminderEvents_Users_UserId",
                table: "ReminderEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReminderEvents",
                table: "ReminderEvents");

            migrationBuilder.DeleteData(
                table: "ReminderEvents",
                keyColumn: "Id",
                keyValue: new Guid("2ff9c1f7-9ace-428a-871b-3525d7a1f2b8"));

            migrationBuilder.DeleteData(
                table: "Pets",
                keyColumn: "Id",
                keyValue: new Guid("24a728b2-409d-4c3d-8504-084a84a0527d"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("58cb444b-8d65-4671-9a65-69921a1488f1"));

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "ReminderEvents");

            migrationBuilder.RenameTable(
                name: "ReminderEvents",
                newName: "ReminderEvent");

            migrationBuilder.RenameIndex(
                name: "IX_ReminderEvents_UserId",
                table: "ReminderEvent",
                newName: "IX_ReminderEvent_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ReminderEvents_PetId",
                table: "ReminderEvent",
                newName: "IX_ReminderEvent_PetId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReminderEvent",
                table: "ReminderEvent",
                column: "Id");

            migrationBuilder.InsertData(
                table: "Pets",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[] { new Guid("d9fb36ab-6849-4e98-af12-ce291f087073"), new DateTime(2024, 11, 3, 0, 40, 57, 499, DateTimeKind.Utc).AddTicks(6504), "TestPet" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLoginAt", "Name", "PasswordHash" },
                values: new object[] { new Guid("c4477470-7d5b-4a7f-956f-6d409f78361a"), new DateTime(2024, 11, 3, 0, 40, 57, 499, DateTimeKind.Utc).AddTicks(6418), "test@example.com", null, "Test User", "test123" });

            migrationBuilder.AddForeignKey(
                name: "FK_ReminderEvent_Pets_PetId",
                table: "ReminderEvent",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReminderEvent_Users_UserId",
                table: "ReminderEvent",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
