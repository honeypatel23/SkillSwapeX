namespace SkillSwape.Middleware
{
    public class CustomMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Before next middleware
            Console.WriteLine("Request incoming: " + context.Request.Path);

            // Call the next middleware in the pipeline
            await _next(context);

            // After next middleware
            Console.WriteLine("Response outgoing: " + context.Response.StatusCode);

        }
    }
}
