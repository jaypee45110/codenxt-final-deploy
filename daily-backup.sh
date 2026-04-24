#!/bin/bash

PROJECT_DIR="/Users/jan/event-platform/codenxt-final-deploy"
BACKUP_DIR="$PROJECT_DIR/backups"
DATE=$(date +%Y%m%d_%H%M)

mkdir -p "$BACKUP_DIR"

echo "=== Daily backup started at $(date) ==="

# Viktige filer vi tar backup av hver dag
cp "$PROJECT_DIR/src/App.jsx"              "$BACKUP_DIR/App_$DATE.jsx"              2>/dev/null || echo "Warning: App.jsx not found"
cp "$PROJECT_DIR/src/CheckoutPage.jsx"     "$BACKUP_DIR/CheckoutPage_$DATE.jsx"     2>/dev/null || echo "Warning: CheckoutPage.jsx not found"
cp "$PROJECT_DIR/src/Dashboard.jsx"        "$BACKUP_DIR/Dashboard_$DATE.jsx"        2>/dev/null || echo "Warning: Dashboard.jsx not found"
cp "$PROJECT_DIR/src/DashboardPage.jsx"    "$BACKUP_DIR/DashboardPage_$DATE.jsx"    2>/dev/null || echo "Warning: DashboardPage.jsx not found"
cp "$PROJECT_DIR/src/EventPage.jsx"        "$BACKUP_DIR/EventPage_$DATE.jsx"        2>/dev/null || echo "Warning: EventPage.jsx not found"
cp "$PROJECT_DIR/src/OrderPage.jsx"        "$BACKUP_DIR/OrderPage_$DATE.jsx"        2>/dev/null || echo "Warning: OrderPage.jsx not found"
cp "$PROJECT_DIR/src/PaymentPage.jsx"      "$BACKUP_DIR/PaymentPage_$DATE.jsx"      2>/dev/null || echo "Warning: PaymentPage.jsx not found"

echo "Backup completed successfully: $BACKUP_DIR"
echo "Files backed up with timestamp: $DATE"

# Slett backups eldre enn 30 dager
find "$BACKUP_DIR" -name "*.jsx" -mtime +30 -delete
echo "Old backups older than 30 days have been cleaned up."
