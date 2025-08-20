# Documentation Scripts

This directory contains scripts to maintain consistent documentation across the project.

## Files

- `sync-docs.js` - Synchronizes content between MASTER_DOCUMENTATION.md and README.md

## Usage

### Automatic Synchronization
Documentation is automatically synchronized before each commit through a git pre-commit hook.

### Manual Synchronization
To manually synchronize the documentation, run:

```bash
npm run docs:sync
```

## How It Works

1. The script updates the timestamp in MASTER_DOCUMENTATION.md
2. It extracts relevant content from MASTER_DOCUMENTATION.md
3. It updates README.md with the synchronized content
4. Both files are added to the commit automatically

## Maintaining Consistency

To maintain consistency:
1. Always update MASTER_DOCUMENTATION.md as the source of truth
2. The script will automatically propagate changes to README.md
3. Only essential documentation files are maintained