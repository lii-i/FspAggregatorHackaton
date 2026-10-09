using Microsoft.AspNetCore.Mvc;

public static class EndPoints{
    public static void AddEndPoints(this WebApplication app){

        app.MapGet("/api/candidates", async (
            [FromQuery(Name="page")] int? page,
            [FromQuery(Name="pageSize")] int? pageSize,
            [FromQuery(Name="searchQuery")] string? searchQuery,
            [FromQuery(Name="category")] string? category,
            [FromQuery(Name="stack")] string? stack,
            [FromQuery(Name="discipline")] string? discipline,
            [FromQuery(Name="sportRank")] string? sportRank,
            [FromQuery(Name="grade")] string? grade,
            [FromQuery(Name="maxSalary")] int? maxSalary,
            [FromQuery(Name="hasFsp")] bool? hasFsp,
            [FromQuery(Name="sortBy")] string? sortBy,
            [FromServices] CandidateService service
        ) => {
            RequestSearchParamsDTO searchParams = new RequestSearchParamsDTO{
                Page = page,
                PageSize = pageSize,
                SearchQuery = searchQuery,
                Category = category,
                Stack = stack,
                Discipline = discipline,
                SportRank = sportRank,
                Grade = grade,
                MaxSalary = maxSalary,
                HasFsp = hasFsp,
                SortBy = sortBy
            };

            var result = await service.GetCandidateForParamsAsync(searchParams);

            if(result.ErrorCount == 1){
                return Results.Problem("Ошибка базы данных", statusCode: 500);
            }
            return Results.Ok(result.Candidates);
        });

        // app.MapPost("/api/candidates", async (
        //     [FromBody] RequestAddCandiate candiate,
        //     [FromServices] CandidateService service)  => {
            
        //     await service.AddCandiateAsync(candiate);
        //     return Results.Ok(new {success = true, message = "Кандидат успешно добавлен"});

        // });

    }
}