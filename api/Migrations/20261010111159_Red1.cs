using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FspAggregatorHackaton.Migrations
{
    /// <inheritdoc />
    public partial class Red1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategorySpecialization",
                table: "Candidates");

            migrationBuilder.AddColumn<string[]>(
                name: "CategorySpecialization",
                table: "Candidates",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CategorySpecialization",
                table: "Candidates",
                type: "text",
                nullable: true,
                oldClrType: typeof(string[]),
                oldType: "text[]",
                oldNullable: true);
        }
    }
}
