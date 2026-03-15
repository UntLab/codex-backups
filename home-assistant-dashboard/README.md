# Дашборд Home Assistant — панель температуры

## Панель «Все датчики температуры»

Файл `temperature-sensors-panel.yaml` содержит конфигурацию вкладки Lovelace, которая отображает **все** датчики температуры из Home Assistant.

### Добавление в Merscom Assistant

1. **Убедитесь, что установлен lovelace-auto-entities:**
   - HACS → Frontend → поиск «Auto Entities» → установить
   - Перезагрузить браузер

2. **Добавьте панель в дашборд:**
   - Откройте Home Assistant → Панель обзора
   - Нажмите «…» (три точки) → «Редактировать дашборд»
   - «+ Добавить вкладку» (или «Добавить представление»)
   - Выберите «Создать пустое» и перейдите в режим редактирования (карандаш)
   - «…» → «Редактировать в YAML»
   - Скопируйте содержимое `temperature-sensors-panel.yaml` (без комментариев)
   - Либо вставьте как новую карточку на существующую вкладку

3. **Альтернатива — без HACS:**
   - Используйте обычную карточку `entities`
   - Добавьте вручную `entity_id` ваших датчиков:
   ```yaml
   type: entities
   title: Датчики температуры
   entities:
     - sensor.living_room_temperature
     - sensor.bedroom_temperature
     - sensor.outside_temperature
   ```
   - Список entity_id: Настройки → Устройства и сущности → Фильтр: «температура»

### Структура в YAML-режиме

Для добавления как новой вкладки в `ui-lovelace.yaml`:

```yaml
views:
  # ... другие вкладки ...
  - title: Температура
    path: temperature
    icon: mdi:thermometer
    cards:
      - type: custom:auto-entities
        filter:
          include:
            - domain: sensor
              attributes:
                device_class: temperature
        card:
          type: entities
          title: Все датчики температуры
        sort:
          method: name
```
