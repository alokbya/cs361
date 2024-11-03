﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace PetReminders.Data.Migrations
{
    [DbContext(typeof(PetReminderContext))]
    [Migration("20241103002744_InitialCreateWithGuids")]
    partial class InitialCreateWithGuids
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("PetReminders.Core.Models.Pet", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Pets");

                    b.HasData(
                        new
                        {
                            Id = new Guid("cf85e479-f743-4309-afca-ac58b347d2f4"),
                            CreatedAt = new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(8026),
                            Name = "TestPet"
                        });
                });

            modelBuilder.Entity("PetReminders.Core.Models.ReminderEvent", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("EventTIme")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("PetId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("PetId");

                    b.HasIndex("UserId");

                    b.ToTable("ReminderEvent");
                });

            modelBuilder.Entity("PetReminders.Core.Models.Schedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<Guid?>("PetId")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("TimeSpan")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("PetId");

                    b.ToTable("Schedule");
                });

            modelBuilder.Entity("PetReminders.Core.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("LastLoginAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = new Guid("6d590849-56f0-4418-8c9c-1d19ef1336c6"),
                            CreatedAt = new DateTime(2024, 11, 3, 0, 27, 43, 807, DateTimeKind.Utc).AddTicks(7912),
                            Email = "test@example.com",
                            Name = "Test User",
                            PasswordHash = "test123"
                        });
                });

            modelBuilder.Entity("PetUser", b =>
                {
                    b.Property<Guid>("PetsId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UsersId")
                        .HasColumnType("TEXT");

                    b.HasKey("PetsId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("PetUser");
                });

            modelBuilder.Entity("PetReminders.Core.Models.ReminderEvent", b =>
                {
                    b.HasOne("PetReminders.Core.Models.Pet", "Pet")
                        .WithMany("FeedingEvents")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetReminders.Core.Models.User", "User")
                        .WithMany("FeedingEvents")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pet");

                    b.Navigation("User");
                });

            modelBuilder.Entity("PetReminders.Core.Models.Schedule", b =>
                {
                    b.HasOne("PetReminders.Core.Models.Pet", null)
                        .WithMany("FeedingSchedules")
                        .HasForeignKey("PetId");
                });

            modelBuilder.Entity("PetUser", b =>
                {
                    b.HasOne("PetReminders.Core.Models.Pet", null)
                        .WithMany()
                        .HasForeignKey("PetsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PetReminders.Core.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("PetReminders.Core.Models.Pet", b =>
                {
                    b.Navigation("FeedingEvents");

                    b.Navigation("FeedingSchedules");
                });

            modelBuilder.Entity("PetReminders.Core.Models.User", b =>
                {
                    b.Navigation("FeedingEvents");
                });
#pragma warning restore 612, 618
        }
    }
}
