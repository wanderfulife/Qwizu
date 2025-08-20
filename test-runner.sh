#!/bin/bash

# Test Runner Script

echo "Survey Processor Test Runner"
echo "============================"

case "$1" in
  "all")
    echo "Running all tests..."
    npm test
    ;;
  "watch")
    echo "Running tests in watch mode..."
    npm run test:watch
    ;;
  "coverage")
    echo "Running tests with coverage..."
    npm run test:coverage
    ;;
  "unit")
    echo "Running unit tests..."
    npm test -- --testPathPatterns="src/__tests__/utils/"
    ;;
  "integration")
    echo "Running integration tests..."
    npm test -- --testPathPatterns="src/__tests__/lib/"
    ;;
  *)
    echo "Usage: ./test-runner.sh [all|watch|coverage|unit|integration]"
    echo ""
    echo "  all         - Run all tests"
    echo "  watch       - Run tests in watch mode"
    echo "  coverage    - Run tests with coverage report"
    echo "  unit        - Run unit tests only"
    echo "  integration - Run integration tests only"
    ;;
esac