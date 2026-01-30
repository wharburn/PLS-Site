#!/bin/bash

# Create Render persistent disk directory structure
STORAGE_ROOT="/mnt/data"
UPLOADS_DIR="$STORAGE_ROOT/uploads"

echo "Setting up persistent disk storage at $STORAGE_ROOT..."

# Create main directories
mkdir -p "$UPLOADS_DIR"
mkdir -p "$UPLOADS_DIR/clients"
mkdir -p "$UPLOADS_DIR/temp"
mkdir -p "$UPLOADS_DIR/archived"

# Create client subdirectories
for i in {1..10}; do
    mkdir -p "$UPLOADS_DIR/clients/client_$i"
    mkdir -p "$UPLOADS_DIR/clients/client_$i/invoices"
    mkdir -p "$UPLOADS_DIR/clients/client_$i/contracts"
    mkdir -p "$UPLOADS_DIR/clients/client_$i/documents"
    mkdir -p "$UPLOADS_DIR/clients/client_$i/identity"
done

# Set permissions
chmod -R 755 "$STORAGE_ROOT"
chmod -R 777 "$UPLOADS_DIR"

echo "✅ Directory structure created:"
tree "$UPLOADS_DIR" 2>/dev/null || find "$UPLOADS_DIR" -type d | head -20

echo ""
echo "Storage ready at: $UPLOADS_DIR"
