#!/bin/zsh

STAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_DIR="/Users/jan/event-platform/codenxt-final-deploy/backups/$STAMP"

mkdir -p "$BACKUP_DIR"

cp /Users/jan/event-platform/codenxt-final-deploy/src/pages/Dashboard.jsx "$BACKUP_DIR/Dashboard.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/CheckoutPage.jsx "$BACKUP_DIR/CheckoutPage.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/JoinPage.jsx "$BACKUP_DIR/JoinPage.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/App.jsx "$BACKUP_DIR/App.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/pages/PrintPoster.jsx "$BACKUP_DIR/PrintPoster.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/pages/ScreenPlayer.jsx "$BACKUP_DIR/ScreenPlayer.jsx"
cp /Users/jan/event-platform/codenxt-final-deploy/src/components/BadgeGeneratorModal.jsx "$BACKUP_DIR/BadgeGeneratorModal.jsx"
cp /Users/jan/event-platform/codenxt-backend/server.js "$BACKUP_DIR/server.js"

echo "Backup completed: $STAMP" >> /Users/jan/event-platform/codenxt-final-deploy/backups/backup-log.txt
