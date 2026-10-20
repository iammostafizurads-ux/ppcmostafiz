$botToken = "8941219541:AAG22mPeFT1t_TB52-j2mXwhrZiXUAiKDpY"
$chatId = "5362664324"

$text = @"
🚀 *PPC Mostafiz Portfolio Bot Connected!*

Hi Mostafizur, your Telegram bot is now successfully linked to your website.

Whenever a potential client requests a *Free Google Ads Audit* on your site, you will receive an instant notification here with:
• Client Full Name
• Business Email
• Website URL
• Monthly Ad Spend Budget
• Project Challenge / Goal

System Status: *Operational & Live*
"@

$payload = @{
    chat_id = $chatId
    text = $text
    parse_mode = "Markdown"
} | ConvertTo-Json -Compress

$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)

$res = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/sendMessage" -Method Post -Body $utf8Bytes -ContentType "application/json; charset=utf-8"
$res | ConvertTo-Json
