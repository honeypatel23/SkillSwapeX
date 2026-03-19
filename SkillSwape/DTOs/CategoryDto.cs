using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs
{
    public class CategoryDto
    {
        // Used for Update / Get
        public int CategoryId { get; set; }

        public string CategoryName { get; set; }
    }
}
