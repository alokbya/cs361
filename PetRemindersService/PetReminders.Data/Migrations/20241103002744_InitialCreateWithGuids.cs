using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetReminders.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithGuids : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TimeSpan = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    PetId = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedule_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PetUser",
                columns: table => new
                {
                    PetsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsersId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetUser", x => new { x.PetsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_PetUser_Pets_PetsId",
                        column: x => x.PetsId,
                        principalTable: "Pets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PetUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReminderEvent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    EventTIme = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PetId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReminderEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReminderEvent_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReminderEvent_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Pets",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[] { new Guid("cf85e479-f743-4309-afca-ac58b347d2f4"), new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(8026), "TestPet" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "LastLoginAt", "Name", "PasswordHash" },
                values: new object[] { new Guid("6d590849-56f0-4418-8c9c-1d19ef1336c6"), new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(7912), "test@example.com", null, "Test User", "test123" });

            migrationBuilder.CreateIndex(
                name: "IX_PetUser_UsersId",
                table: "PetUser",
                column: "UsersId");

            migrationBuilder.CreateIndex(
                name: "IX_ReminderEvent_PetId",
                table: "ReminderEvent",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_ReminderEvent_UserId",
                table: "ReminderEvent",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_PetId",
                table: "Schedule",
                column: "PetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PetUser");

            migrationBuilder.DropTable(
                name: "ReminderEvent");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Pets");
        }
    }
}
