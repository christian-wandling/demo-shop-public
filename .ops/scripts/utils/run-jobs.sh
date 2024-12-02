#!/bin/bash

run_jobs() {
  local container_name="$1"
  local -a job_files=("${@:2}")
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logging-utils.sh"

  # Validate input parameters
  if [ -z "$container_name" ]; then
    log_error "Missing required parameters."
    log_error "Usage: run_jobs <container_name> [job_files...]"
    log_error "Example: run_jobs \"prisma\" \"job1.yaml\" \"job2.yaml\""
    return 1
  fi

  if [ ${#job_files[@]} -eq 0 ]; then
    return 0
  fi

  for job_file in "${job_files[@]}"; do
    if ! run_job "$container_name" "$job_file"; then
      log_error "Failed to run job for $container_name from file: $job_file"
      return 1
    fi
  done
}

run_job() {
  local container_name="$1"
  local job_file="$2"
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "${SCRIPT_DIR}/logging-utils.sh"

  # Check if job_file is set
  if [[ -z "$job_file" ]]; then
    log_error "Job file must be provided."
    return 1
  fi

  log_info "Running job: $job_file in container: $container_name"

  kubectl apply -f "$job_file"
  if [ $? -ne 0 ]; then
    log_error "Error applying job file: $job_file"
    return 1
  fi

  # Wait for the job to complete
  kubectl wait --for=condition=complete --timeout=60s "job/$(basename "$job_file" .yaml)"

  if [ $? -eq 0 ]; then
    log_info "Job completed successfully. Deleting job..."
    kubectl delete job "$(basename "$job_file" .yaml)"
  else
    log_error "Job did not complete successfully."
    return 1
  fi

  return 0
}
