#!/bin/bash

if [ -z "$RED" ]; then
  readonly RED='\033[0;31m'
fi
if [ -z "$GREEN" ]; then
  readonly GREEN='\033[0;32m'
fi
if [ -z "$YELLOW" ]; then
  readonly YELLOW='\033[1;33m'
fi
if [ -z "$BLUE" ]; then
  readonly BLUE='\033[0;34m'
fi
if [ -z "$PURPLE" ]; then
  readonly PURPLE='\033[0;35m'
fi
if [ -z "$CYAN" ]; then
  readonly CYAN='\033[0;36m'
fi
if [ -z "$NC" ]; then
  readonly NC='\033[0m' # No Color
fi

# Logging level configuration
# Set default log level if not already set
# Available levels: DEBUG=0, INFO=1, WARN=2, ERROR=3
LOG_LEVEL=${LOG_LEVEL:-1}

_get_timestamp() {
  date "+%Y-%m-%d %H:%M:%S"
}

log_debug() {
  if [ "${LOG_LEVEL}" -le 0 ]; then
    echo -e "$(_get_timestamp) ${BLUE}[DEBUG]${NC} $1" >&2
  fi
}

log_info() {
  if [ "${LOG_LEVEL}" -le 1 ]; then
    echo -e "$(_get_timestamp) ${GREEN}[INFO]${NC} $1" >&2
  fi
}

log_warn() {
  if [ "${LOG_LEVEL}" -le 2 ]; then
    echo -e "$(_get_timestamp) ${YELLOW}[WARN]${NC} $1" >&2
  fi
}

log_error() {
  if [ "${LOG_LEVEL}" -le 3 ]; then
    echo -e "$(_get_timestamp) ${RED}[ERROR]${NC} $1" >&2
  fi
}

log_success() {
  echo -e "$(_get_timestamp) ${GREEN}[SUCCESS]${NC} $1" >&2
}

log_fatal() {
  echo -e "$(_get_timestamp) ${RED}[FATAL]${NC} $1" >&2
  exit 1
}

set_log_level() {
  case "${1,,}" in
  debug | 0) LOG_LEVEL=0 ;;
  info | 1) LOG_LEVEL=1 ;;
  warn | 2) LOG_LEVEL=2 ;;
  error | 3) LOG_LEVEL=3 ;;
  *) log_warn "Invalid log level '$1'. Using default (INFO)" ;;
  esac
}

is_sourced() {
  if [ "${BASH_SOURCE[0]}" -ef "$0" ]; then
    return 1 # Script is being run directly
  else
    return 0 # Script is being sourced
  fi
}

if ! is_sourced; then
  log_debug "This is a debug message"
  log_info "This is an info message"
  log_warn "This is a warning message"
  log_error "This is an error message"
  log_success "This is a success message"
fi

# Export all logging functions and variables
export RED GREEN YELLOW BLUE PURPLE CYAN NC
export -f log_debug log_info log_warn log_error log_success log_fatal set_log_level
