#!/usr/bin/env python3
"""Добавляет панель температуры в Lovelace через WebSocket API Home Assistant."""
import json
import asyncio

try:
    import websockets
except ImportError:
    print("Установите: pip install websockets")
    exit(1)

URI = "ws://192.168.10.50:8123/api/websocket"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNGY0NjBjOTczMjE0MTNiYmRlZjg4Y2IxZWE1MWEzMSIsImlhdCI6MTc3MjU2NDY4NywiZXhwIjoyMDg3OTI0Njg3fQ.mNq3yXaDazuUaa15emmjRIoluiBaTfOs9CRCcntbm24"

NEW_VIEW = {
    "title": "Температура",
    "path": "temperature",
    "icon": "mdi:thermometer",
    "panel": False,
    "cards": [
        {
            "type": "custom:auto-entities",
            "filter": {
                "include": [
                    {
                        "domain": "sensor",
                        "attributes": {"device_class": "temperature"},
                    }
                ],
                "exclude": [],
            },
            "card": {
                "type": "entities",
                "title": "Все датчики температуры",
                "icon": "mdi:thermometer",
                "show_header_toggle": False,
            },
            "sort": {"method": "name", "numeric": True},
        }
    ],
}


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
        print("Подключено к Home Assistant")

        # lovelace/config - для default дашборда
        await ws.send(json.dumps({"id": 1, "type": "lovelace/config"}))
        resp = json.loads(await ws.recv())
        if "error" in resp:
            print("Ошибка получения config:", resp["error"])
            return
        config = resp.get("result", {})
        if not config:
            print("Пустой config или YAML-режим")
            return

        views = config.get("views", [])
        if any(v.get("path") == "temperature" for v in views):
            print("Вкладка 'Температура' уже существует")
            return

        views.append(NEW_VIEW)
        config["views"] = views

        await ws.send(
            json.dumps({"id": 2, "type": "lovelace/config/save", "config": config})
        )
        resp = json.loads(await ws.recv())
        if "error" in resp:
            print("Ошибка сохранения:", resp["error"])
            return
        print("Панель 'Температура' успешно добавлена!")


if __name__ == "__main__":
    asyncio.run(main())
