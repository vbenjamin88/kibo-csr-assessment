using Microsoft.AspNetCore.Mvc;

namespace KiboCsr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetupController : ControllerBase
{
    private readonly IConfiguration _config;

    public SetupController(IConfiguration config) => _config = config;

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        var key = _config["LLM_API_KEY"] ?? _config["OpenAI:ApiKey"] ?? "";
        var configured = !string.IsNullOrWhiteSpace(key);

        return Ok(new
        {
            configured,
            message = configured
                ? "Ready"
                : "LLM_API_KEY is not set. To enable chat, set the LLM_API_KEY environment variable and restart the backend. See README or SETUP.md for instructions."
        });
    }
}
