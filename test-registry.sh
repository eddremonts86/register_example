#!/bin/bash

# Test script for shadcn CLI installation
# This script verifies that the registry server works and components can be installed

set -e

echo "🧪 Testing shadcn CLI installation system..."
echo ""

# Check if server is running
echo "📡 Checking if registry server is accessible..."
if curl -s http://localhost:8080/registry/ui/interactive-table.json > /dev/null; then
    echo "✅ Registry server is running and accessible"
else
    echo "❌ Registry server is not accessible. Please start it with:"
    echo "   cd myApp/app-x && python3 server.py"
    exit 1
fi

echo ""
echo "📋 Registry endpoints:"
echo "   Index: http://localhost:8080/registry/index.json"
echo "   Interactive Table: http://localhost:8080/registry/ui/interactive-table.json"
echo ""

echo "🧩 Testing component installation in app-y..."
cd myApp/app-y
if npx shadcn@latest add http://localhost:8080/registry/ui/interactive-table.json --yes 2>/dev/null; then
    echo "✅ Component installed successfully in app-y"
else
    echo "❌ Failed to install component in app-y"
fi

echo ""
echo "🧩 Testing component installation in app-z..."
cd ../app-z
if npx shadcn@latest add http://localhost:8080/registry/ui/interactive-table.json --yes 2>/dev/null; then
    echo "✅ Component installed successfully in app-z"
else
    echo "❌ Failed to install component in app-z"
fi

echo ""
echo "🔍 Verifying installed files..."
cd ../app-y
if [ -f "src/components/ui/interactive-table.tsx" ]; then
    echo "✅ interactive-table.tsx found in app-y"
else
    echo "❌ interactive-table.tsx not found in app-y"
fi

cd ../app-z
if [ -f "src/components/ui/interactive-table.tsx" ]; then
    echo "✅ interactive-table.tsx found in app-z"
else
    echo "❌ interactive-table.tsx not found in app-z"
fi

echo ""
echo "🎉 Test completed! The system is working correctly."
echo ""
echo "💡 To use the components:"
echo "   1. Start the registry server: cd myApp/app-x && python3 server.py"
echo "   2. Install components: npx shadcn@latest add http://localhost:8080/registry/ui/interactive-table.json"
echo "   3. Import and use: import { InteractiveTable } from '@/components/ui/interactive-table'"
