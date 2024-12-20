#!/bin/bash

# Default log file location
DEFAULT_LOG_FILE="/var/log/script.log"
LOG_FILE=${LOG_FILE:-$DEFAULT_LOG_FILE}

: "${RED:='\033[0;31m'}"
: "${GREEN:='\033[0;32m'}"
: "${YELLOW:='\033[1;33m'}"
: "${BLUE:='\033[0;34m'}"
: "${PURPLE:='\033[0;35m'}"
: "${CYAN:='\033[0;36m'}"
: "${NC:='\033[0m'}"

# Logging level configuration
# Set default log level if not already set
# Available levels: DEBUG=0, INFO=1, WARN=2, ERROR=3
LOG_LEVEL=${LOG_LEVEL:-1}

_get_timestamp() {
  date "+%Y-%m-%d %H:%M:%S"
}

_log_to_file() {
  local level="$1"
  local message="$2"
  local log_entry
  log_entry="$(_get_timestamp) [$level] $message"

  echo "$log_entry" >>"$LOG_FILE" 2>/dev/null || {
    echo "Error: Cannot write to log file: $LOG_FILE" >&2
    return 1
  }
}

log_debug() {
  if [ "${LOG_LEVEL}" -le 0 ]; then
    echo -e "$(_get_timestamp) ${BLUE}[DEBUG]${NC} $1" >&2
    _log_to_file "DEBUG" "$1"
  fi
}

log_info() {
  if [ "${LOG_LEVEL}" -le 1 ]; then
    echo -e "$(_get_timestamp) ${GREEN}[INFO]${NC} $1" >&2
    _log_to_file "INFO" "$1"
  fi
}

log_warn() {
  if [ "${LOG_LEVEL}" -le 2 ]; then
    echo -e "$(_get_timestamp) ${YELLOW}[WARN]${NC} $1" >&2
    _log_to_file "WARN" "$1"
  fi
}

log_error() {
  if [ "${LOG_LEVEL}" -le 3 ]; then
    echo -e "$(_get_timestamp) ${RED}[ERROR]${NC} $1" >&2
    _log_to_file "ERROR" "$1"
  fi
}

log_success() {
  echo -e "$(_get_timestamp) ${GREEN}[SUCCESS]${NC} $1" >&2
  _log_to_file "SUCCESS" "$1"
}

log_fatal() {
  echo -e "$(_get_timestamp) ${RED}[FATAL]${NC} $1" >&2
  _log_to_file "FATAL" "$1"
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

# Function to set custom log file
set_log_file() {
    if [ -n "$1" ]; then
        LOG_FILE="$1"
        # Test if we can write to the log file
        touch "$LOG_FILE" 2>/dev/null || {
            echo "Error: Cannot write to log file: $LOG_FILE" >&2
            return 1
        }
    fi
}

# Export all logging functions and variables
export LOG_FILE
export -f log_debug log_info log_warn log_error log_success log_fatal set_log_level set_log_file
