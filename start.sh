#!/bin/bash

# Unified script to start Interactive Table Registry applications

# Default apps to start (can be overridden with arguments)
APPS_TO_START=${1:-"x,y"}

echo "🚀 Interactive Component Registry - Startup Script"
echo "================================================="

# Function to handle Ctrl+C
cleanup() {
    echo ""
    echo "🛑 Stopping all applications..."
    kill $APP_X_PID $APP_Y_PID $APP_Z_PID 2>/dev/null
    exit 0
}

# Register cleanup function
trap cleanup SIGINT

# Function to start an app
start_app() {
    local app_name=$1
    local app_dir=$2
    local port=$3
    local description=$4
    local mode=$5

    echo "📦 Starting $app_name ($description)..."
    cd $app_dir
    if [[ "$mode" == "registry" ]]; then
        npm run start-registry-server &
    else
        npm run dev &
    fi
    eval "APP_${app_name}_PID=$!"
    cd ..
    sleep 2
}

# Check if registry mode is requested
if [[ "$APPS_TO_START" == *"registry"* || "$APPS_TO_START" == *"x-registry"* ]]; then
    echo "🗃️  Starting in Registry Server mode..."
    start_app "X" "app-x" "5173" "Registry Server (Static)" "registry"
    echo ""
    echo "✅ Registry server started!"
    echo ""
    echo "🌐 Registry available at:"
    echo "   • Registry Root: http://localhost:5173/r/"
    echo "   • Registry Index: http://localhost:5173/r/registry.json"
    echo "   • Interactive Table: http://localhost:5173/r/interactive-table.json"
    echo ""
    echo "🔧 Usage in consumer apps:"
    echo "   npx shadcn@latest add @myapp/interactive-table"
    echo ""
    echo "⌨️  Press Ctrl+C to stop the registry server"
    wait
    exit 0
fi

# Parse which apps to start
IFS=',' read -ra APPS <<< "$APPS_TO_START"

for app in "${APPS[@]}"; do
    case $app in
        "x"|"X")
            start_app "X" "app-x" "5173" "Component Registry Provider"
            ;;
        "y"|"Y")
            start_app "Y" "app-y" "5174" "Enhanced Consumer with API"
            ;;
        "z"|"Z")
            start_app "Z" "app-z" "5175" "Tailwind CSS Integration"
            ;;
        *)
            echo "❌ Unknown app: $app (valid options: x, y, z)"
            ;;
    esac
done

echo ""
echo "✅ Applications started successfully!"
echo ""
echo "🌐 Available URLs:"

# Show URLs for started apps
for app in "${APPS[@]}"; do
    case $app in
        "x"|"X")
            echo "   • app-x (Registry Provider):     http://localhost:5173"
            ;;
        "y"|"Y")
            echo "   • app-y (Enhanced Consumer):     http://localhost:5174"
            ;;
        "z"|"Z")
            echo "   • app-z (Tailwind Integration): http://localhost:5175"
            ;;
    esac
done

echo ""
echo "💡 Features to test:"
echo "   • 7 columns of data across all apps"
echo "   • 4 editable columns (marked with ✏️)"
echo "   • Implicit saving with onBlur events"
echo "   • Different business domains per app"
if [[ "$APPS_TO_START" == *"y"* || "$APPS_TO_START" == *"Y"* ]]; then
    echo "   • API integration with Jikan (app-y)"
    echo "   • Pagination and infinite scroll (app-y)"
fi
if [[ "$APPS_TO_START" == *"z"* || "$APPS_TO_START" == *"Z"* ]]; then
    echo "   • Tailwind CSS integration (app-z)"
fi
echo ""
echo "🎯 Usage examples:"
echo "   ./start.sh             # Start app-x and app-y (default)"
echo "   ./start.sh x,y,z       # Start all three apps"
echo "   ./start.sh z           # Start only app-z"
echo "   ./start.sh x,z         # Start app-x and app-z"
echo "   ./start.sh registry    # Start registry server only"
echo ""
echo "⌨️  Press Ctrl+C to stop all applications"

# Wait for all background processes

# Wait for all background processes
wait
