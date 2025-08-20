#!/bin/bash

echo "=== Yuri AI Backend Status Check ==="
echo

# 检查服务器状态
echo "1. Checking server status..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
else
    echo "❌ Server is not running. Run 'npm run dev' first"
    exit 1
fi
echo

# 检查API响应
echo "2. Checking API endpoints..."
endpoints=("/api/devices" "/api/models" "/api/tasks")

for endpoint in "${endpoints[@]}"; do
    response=$(curl -s -w "%{http_code}" "http://localhost:3001$endpoint")
    http_code="${response: -3}"
    body="${response%???}"
    
    echo "GET $endpoint: HTTP $http_code"
    if [[ "$http_code" == "200" || "$http_code" == "201" ]]; then
        echo "✅ Endpoint working"
    elif [[ "$http_code" == "500" ]]; then
        echo "⚠️  Server error (check database tables): $body"
    else
        echo "❌ Error: $body"
    fi
done
echo

echo "=== Status Check Complete ==="
echo "Note: If you see 'Could not find table' errors, make sure to:"
echo "1. Create the tables in your Supabase project using the db.sql schema"
echo "2. Import the init_db.sql data"
echo "3. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"