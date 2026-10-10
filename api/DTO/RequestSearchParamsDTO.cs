public class RequestSearchParamsDTO 
{
    public int? Page { get; set; }
    public int? PageSize { get; set; }
    public string? Category { get; set; }
    public string? Stack { get; set; }
    public string? Discipline { get; set; }
    public string? SportRank { get; set; }
    public string? Grade { get; set; }
    public int? MaxSalary { get; set; }
    public bool? HasFsp { get; set; }
    public string? SortBy { get; set; }
}