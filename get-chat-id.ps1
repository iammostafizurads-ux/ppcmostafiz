# Telegram Bot Chat ID Detector & Connector for PPC Mostafiz Portfolio
$botToken = "8941219541:AAG22mPeFT1t_TB52-j2mXwhrZiXUAiKDpY"

Write-Host "Checking for incoming messages from Telegram Bot API..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getUpdates" -Method Get
    if ($response.ok -and $response.result.Count -gt 0) {
        $lastUpdate = $response.result[-1]
        $msg = $lastUpdate.message
        if (-not $msg) {
            $msg = $lastUpdate.my_chat_member
        }
        $chatId = $msg.chat.id
        $senderName = "$($msg.from.first_name) $($msg.from.last_name)".Trim()
        $username = $msg.from.username

        Write-Host "SUCCESS! Found incoming message." -ForegroundColor Green
        Write-Host "Sender: $senderName (@$username)" -ForegroundColor Yellow
        Write-Host "Chat ID: $chatId" -ForegroundColor Yellow

        # Update js/main.js with the real chatId
        $jsPath = Join-Path $PSScriptRoot "js\main.js"
        if (Test-Path $jsPath) {
            $jsContent = Get-Content $jsPath -Raw
            if ($jsContent -match "chatId:\s*'[^']*'") {
                $jsContent = $jsContent -replace "chatId:\s*'[^']*'", "chatId: '$chatId'"
                Set-Content -Path $jsPath -Value $jsContent -NoNewline
                Write-Host "Updated js/main.js with Chat ID: $chatId!" -ForegroundColor Green
            }
        }

        # Send test confirmation message to the user's Telegram!
        $testMsg = "✅ *PPC Mostafiz Portfolio Connected!*`n`nYour Telegram bot is now successfully linked to your website's Free Audit Form.`nEvery new lead will arrive here instantly!"
        $body = @{
            chat_id = $chatId
            text = $testMsg
            parse_mode = "Markdown"
        } | ConvertTo-Json

        $sendResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" -Method Post -Body $body -ContentType "application/json"
        if ($sendResult.ok) {
            Write-Host "Test notification successfully sent to Telegram!" -ForegroundColor Green
        }
    } else {
        Write-Host "No messages received yet." -ForegroundColor Yellow
        Write-Host "Please open https://t.me/ppcmostafizbot in Telegram and press START (or send 'hi')." -ForegroundColor Cyan
        Write-Host "Then run this script again!" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error connecting to Telegram Bot API: $_" -ForegroundColor Red
}
