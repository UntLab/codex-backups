# GitHub sync workflow

## Основной режим работы

Если проекты редактируются прямо внутри этого репозитория, используй только прямой git-sync:

### Перед началом работы на любой машине
```bash
cd <repo-root>
bash scripts/direct-pull.sh main
```

### После завершения работы
```bash
cd <repo-root>
bash scripts/direct-push.sh main
```

Или с явным сообщением коммита:
```bash
cd <repo-root>
bash scripts/direct-push.sh main "sync: short description"
```

## Первый запуск на новой машине

```bash
git clone https://github.com/UntLab/codex.git <folder>
cd <folder>
bash scripts/direct-pull.sh main
```

## Важно

- Не используй `bash scripts/backup-push.sh` как основной сценарий, если работаешь прямо внутри этого репозитория.
- `backup-push.sh` вызывает `sync-sources.sh`, а тот зеркалит внешние папки через `rsync --delete`.
- Такой режим подходит только для старого mirror-backup сценария, но не для прямой ежедневной работы в `codex`.
