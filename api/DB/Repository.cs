using Microsoft.EntityFrameworkCore;

public class Repository {

    private DbContextFsp _db;

    public Repository(DbContextFsp db){
        _db = db;
    }

    public async Task<List<CandidatesEntity>> GetCandidateForParamsAsync(RequestSearchParamsDTO searchParams){
        IQueryable<CandidatesEntity> query = _db.Candidates;
    
       if (!string.IsNullOrWhiteSpace(searchParams.SearchQuery))
        {
            var searchWords = searchParams.SearchQuery
                .Split(',')
                .Select(w => w.Trim().ToLower())
                .Where(w => !string.IsNullOrEmpty(w))
                .ToList();

            //выборка И
            foreach (var word in searchWords)
            {
                query = query.Where(c => 
                    (c.FullName != null && c.FullName.ToLower().Contains(word)) ||
                    (c.Handle != null && c.Handle.ToLower().Contains(word)) ||
                    (c.PrimaryStack != null && c.PrimaryStack.Any(stackItem => stackItem.ToLower().Contains(word)))
                );
            }
        }

        if(!string.IsNullOrEmpty(searchParams.Category)){
            var categories = searchParams.Category
            .Split(",")
            .Select(c => c.Trim().ToLower())
            .Where(c => !string.IsNullOrEmpty(c))
            .ToList();

            query = query.Where(c => c.CategorySpecialization != null && categories.Contains(c.CategorySpecialization.ToLower()));
        }
        
        if(!string.IsNullOrEmpty(searchParams.Stack)){
            var Stack = searchParams.Stack
            .Split(",")
            .Select(s => s.Trim().ToLower())
            .Where(s => !string.IsNullOrEmpty(s))
            .ToList();

            //делаем выборку И
            foreach(var stackItem in Stack){
                query = query.Where(c => (c.PrimaryStack != null && c.PrimaryStack.Any(s => s.ToLower().Contains(stackItem))));
            }
        }

        if(!string.IsNullOrEmpty(searchParams.Discipline)){
            var disciplines = searchParams.Discipline
            .Split(",")
            .Select(d => d.ToLower().Trim())
            .Where(d => !string.IsNullOrEmpty(d))
            .ToList();

            //делаем выборку И
            foreach(var discipline in disciplines){
                query = query.Where(c => (c.FspAchivements != null && c.FspAchivements.Any(a => a.Discipline.ToLower().Contains(discipline))));
            }
        }

        if(!string.IsNullOrEmpty(searchParams.SportRank)){
            var ranks = searchParams.SportRank
            .Split(",")
            .Select(r => r.ToLower().Trim())
            .Where(r => !string.IsNullOrEmpty(r))
            .ToList();

            // Логика ИЛИ 
            query = query.Where(c => c.FspSportRang != null && ranks.Contains(c.FspSportRang.ToLower()));
        }

        if(!string.IsNullOrEmpty(searchParams.Grade)){
            var grades = searchParams.Grade
            .Split(",")
            .Select(g => g.ToLower().Trim())
            .Where(g => !string.IsNullOrEmpty(g))
            .ToList();
            
            query = query.Where(c => c.Grade!=null && grades.Any(g => g.Contains(c.Grade.ToLower())));
        }

        if(searchParams.MaxSalary != null){
            query = query.Where(c => c.SalaryMin != null && c.SalaryMin <= searchParams.MaxSalary);
        }

        if(searchParams.HasFsp != null && searchParams.HasFsp == true){
            query = query.Where(c => c.FspId != null && c.FspId != "");
        }

        if(!string.IsNullOrEmpty(searchParams.SortBy)){
            switch(searchParams.SortBy.ToLower().Trim()){
                case "rating":
                    query = query.OrderByDescending(c => c.FspRatingScore);
                    break;
                case "salary_asc":
                    query = query.OrderBy(c => c.SalaryMin);
                    break;
                case "salary_desc":
                    query = query.OrderByDescending(c => c.SalaryMin);
                    break;
                default:
                    query = query.OrderByDescending(c => c.FspRatingScore);
                    break;
            }
        }

        
        int page = searchParams.Page ?? 1;
        int pageSize = searchParams.PageSize ?? 20;

        List<CandidatesEntity> responseList = await query
            .Include(c => c.RadarSkills)
            .Include(c => c.FspAchivements)
            .Include(c => c.JobOffers)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return responseList;
    }

    // public async Task AddCandiateAsync(RequestAddCandiate candiate){
    //     CandidatesEntity candidate = new CandidatesEntity();
    //     candidate.FullName = candiate.FullName;
    //     candidate.AvaaterURL = candiate.AvaaterURL;
    //     candidate.Handle = candiate.Handle;
    //     candidate.City = candiate.City;
    //     candidate.Grade = candiate.Grade;
    //     candidate.CategorySpecialization = candiate.CategorySpecialization;
    //     candidate.SalaryMax = candiate.SalaryMax;
    //     candidate.SalaryMin = candiate.SalaryMin;
    //     candidate.PrimaryStack = candiate.PrimaryStack;
    //     candidate.Bio = candiate.Bio;
    //     candidate.IsOpenToOffers = candiate.IsOpenToOffers;
    //     candidate.TestIsPassed = candiate.TestIsPassed;
    //     candidate.TestedGrade = candiate.TestedGrade;
    //     candidate.TestPassedAt = candiate.TestPassedAt;
    //     candidate.TestCoolDownUntil = candiate.TestCoolDownUntil;
    //     candidate.Telegram = candiate.Telegram;
    //     candidate.Email = candiate.Email;
    //     candidate.Phone = candiate.Phone;
    //     candidate.FspId = candiate.FspId;
    //     candidate.FspSportRang = candiate.FspSportRang;
    //     candidate.FspRatingScore = candiate.FspRatingScore;
        
    //     _db.Candidates.Add(candidate);
    //     await _db.SaveChangesAsync();
    // }

}