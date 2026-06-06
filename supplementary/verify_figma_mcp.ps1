Write-Host "Checking Figma MCP server on 127.0.0.1:3845..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:3845/mcp" -Method Get
    Write-Host "Success! Server is reachable." -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "Failed to connect to Figma MCP server." -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "Please ensure 'MCP Server' is enabled in the Dev Mode right sidebar within a Figma design file." -ForegroundColor Yellow
}
