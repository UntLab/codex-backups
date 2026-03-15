import logging
import os
from typing import Dict, Tuple

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

N8N_WEBHOOK_URL_BASE = os.getenv("N8N_WEBHOOK_URL_BASE", "http://localhost:5678/webhook-test")
N8N_MOVEMENT_ENDPOINT = os.getenv("N8N_MOVEMENT_ENDPOINT", "terminal-movement")


def send_to_n8n(endpoint: str, payload: Dict) -> Tuple[bool, str, int]:
    url = f"{N8N_WEBHOOK_URL_BASE.rstrip('/')}/{endpoint.lstrip('/')}"
    logger.info(f"Sending data to n8n webhook: {url}")
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return True, response.text or "Success", response.status_code
    except requests.exceptions.RequestException as exc:
        logger.error(f"Failed to communicate with n8n: {exc}")
        status_code = getattr(exc.response, "status_code", 0) if getattr(exc, "response", None) else 0
        return False, f"n8n communication error: {str(exc)}", status_code


def send_movement_event(payload: Dict) -> Tuple[bool, str, int]:
    return send_to_n8n(N8N_MOVEMENT_ENDPOINT, payload)
