#!/usr/bin/env python3
"""Исправляет панель температуры — заменяет auto-entities на стандартную entities."""
import json
import asyncio

try:
    import websockets
except ImportError:
    print("Установите: pip install websockets")
    exit(1)

URI = "ws://192.168.10.50:8123/api/websocket"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNGY0NjBjOTczMjE0MTNiYmRlZjg4Y2IxZWE1MWEzMSIsImlhdCI6MTc3MjU2NDY4NywiZXhwIjoyMDg3OTI0Njg3fQ.mNq3yXaDazuUaa15emmjRIoluiBaTfOs9CRCcntbm24"

# Красивая сетка карточек с мини-графиками
SENSORS = [
    ("sensor.system_monitor_processor_temperature", "Процессор", "mdi:chip"),
    ("sensor.zigbee_bottom_aqara_device_temperature", "Zigbee Aqara", "mdi:zigbee"),
    ("sensor.termometr_main_in_serverroom_temperature", "Серверная", "mdi:server"),
    ("sensor.wii_fi_temperature_humidity_sensor_temperature", "Rack Wi‑Fi", "mdi:access-point"),
    ("sensor.termometr_2_temperature", "Термометр 2", "mdi:thermometer"),
    ("sensor.termometr_home_3_temperature", "Термометр 3", "mdi:thermometer"),
    ("sensor.slzb_06p7_core_chip_temp", "SLZB Core", "mdi:chip"),
    ("sensor.slzb_06p7_zigbee_chip_temp", "SLZB Zigbee", "mdi:chip"),
]

BEAUTIFUL_CARDS = [
    # Заголовок
    {
        "type": "heading",
        "heading": "Все датчики температуры",
        "icon": "mdi:thermometer",
    },
    # Сетка карточек 2 колонки — на десктопе и телефоне выглядит аккуратно
    {
        "type": "grid",
        "columns": 2,
        "square": False,
        "cards": [
            {
                "type": "sensor",
                "entity": entity_id,
                "name": name,
                "icon": icon,
                "graph": "line",
                "hours_to_show": 24,
                "detail": 2,
            }
            for entity_id, name, icon in SENSORS
        ],
    },
]


async def main():
    async with websockets.connect(URI) as ws:
        msg = json.loads(await ws.recv())
        if msg.get("type") != "auth_required":
            print("Ошибка: ожидался auth_required, получен:", msg)
            return
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        msg = json.loads(await ws.recv())
        if msg.get("type") != "auth_ok":
            print("Ошибка авторизации:", msg)
            return

        await ws.send(json.dumps({"id": 1, "type": "lovelace/config"}))
        resp = json.loads(await ws.recv())
        if "error" in resp:
            print("Ошибка получения config:", resp["error"])
            return
        config = resp.get("result", {})
        if not config:
            print("Пустой config")
            return

        views = config.get("views", [])
        updated = False
        for v in views:
            if v.get("path") == "temperature":
                v["cards"] = BEAUTIFUL_CARDS
                updated = True
                break

        if not updated:
            print("Вкладка 'Температура' не найдена")
            return

        await ws.send(
            json.dumps({"id": 2, "type": "lovelace/config/save", "config": config})
        )
        resp = json.loads(await ws.recv())
        if "error" in resp:
            print("Ошибка сохранения:", resp["error"])
            return
        print("Панель исправлена! Обновите страницу.")


if __name__ == "__main__":
    asyncio.run(main())
